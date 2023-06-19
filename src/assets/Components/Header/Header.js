import React, { useEffect, useState } from 'react';
import style from "./Header.module.css"
import GlobalStyle from "../GlobalStyle";

function Header() {
    const [isOpen, SetIsOpen] = useState(false);
    const [newTask, SetNewTask] = useState({})

    const handleCreate = () => {
        SetIsOpen(true);
    }

    const closeModal = () => {
        SetIsOpen(false)
    }
    // Nhấn enter 
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          submitForm();
        }
    }

    const handleChangeTaskCreate = (name, value) => {
        SetNewTask(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // Reset
    const resetFieldCreate = () => {
        let currentDate = new Date();
        let currentDateToFormat = (year, month, day) => (`${year}-${parseInt(month / 10)}${month % 10}-${parseInt(day / 10)}${day % 10}`)

        SetNewTask({
            title: "",
            description: "",
            status: transformState(1),
            dayStart: currentDateToFormat(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()),
            dayEnd: currentDateToFormat(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate() + 1),
            warn: ""
        })
    }

    function formatDate(date) {
        let formDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
        let res = date;

        if (!formDate.test(date)) {
            let year = date.substring(5, date.length);
            let month = date.substring(2, 4);
            let day = date.substring(0, 1);

            res = `${year}-${parseInt(month / 10)}${month % 10}-${parseInt(day / 10)}${day % 10}`;
        }
        return res;
    }

    const transformState = (stateValue) => {
        switch (stateValue) {
            case 1:
                return 'Đang làm';
            case 2:
                return 'Hoàn thành';
            case 3:
                return 'Quá hạn';
            default:
                return '';
        }
    }

    const submitForm = () => {
        let haveBlankFieldValue = false;
        let listBlank = '';

        Object.keys(newTask).forEach(name => {
            if (newTask[name].length === 0 && name !== "warn") {
                haveBlankFieldValue = true;
                listBlank += `${name} `;
            }
        })
        const confirmResult = window.confirm("Thêm công việc ?");
        if (confirmResult) {
            !haveBlankFieldValue
                ? fetch('/createTask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newTask),
                }).then(response => response.json())
                    .then(data => {
                        if (data.status === 'accepted') {
                            closeModal();
                            window.location.reload();
                        }
                        else {
                            alert(`${data.data} đã tồn tại`);
                        }
                    })
                : alert(`${listBlank} còn trống`)
        }
    }

    useEffect(() => {
        document.title = 'Quản lý công việc';
        resetFieldCreate();
    }, []);

    return (
        <GlobalStyle>
            <div className={style.main_heading}>
                <div className={style.heading_header}>
                    <h3>Task managements</h3>
                    <button
                        className={style.button}
                        onClick={handleCreate}
                    >
                        Create new task
                    </button>
                </div>
            </div>
            {isOpen && <div>
                <div className={style.modal}>
                    <div className={style.overlay} onClick={closeModal}>
                    </div>
                    <div className={style.modal_content_wrap}>
                        <div className={style.addN_Close}>
                            <p>New task</p>
                            <button onClick={closeModal}>
                                <i className="fa-solid fa-x"></i>
                            </button>
                        </div>
                        <div className={style.modal_content}>
                            <div className={style.modal_item_wrap}>
                                <p className={style.title_modal_input}>Tiêu đề</p>
                                <input
                                    type='text'
                                    placeholder='Nhập tiêu đề'
                                    value={newTask.title}
                                    onChange={e => handleChangeTaskCreate('title', e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    className={style.input_text_modalbox}>
                                </input>
                            </div>
                            <div className={`${style.modal_item_wrap} ${style.des_fix_height}`}>
                                <p className={style.title_modal_input}>Mô tả</p>
                                <textarea
                                    type='text'
                                    value={newTask.description}
                                    onChange={e => handleChangeTaskCreate('description', e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    className={style.input_text_modalbox}>
                                </textarea>
                            </div>
                            <div className={`${style.modal_item_wrap} ${style.bar_row}`}>
                                <div className={style.bar_row_item}>
                                    <p className={style.title_modal_input}>Ngày bắt đầu</p>
                                    <input
                                        type='date'
                                        value={formatDate(newTask.dayStart)}
                                        onChange={e => handleChangeTaskCreate('dayStart', e.target.value)}
                                    >
                                    </input>
                                </div>
                                <div className={style.bar_row_item}>
                                    <p className={style.title_modal_input}>Đến hạn</p>
                                    <input
                                        type='date'
                                        value={formatDate(newTask.dayEnd)}
                                        onChange={e => {
                                            let startDate = new Date(formatDate(newTask.dayStart));
                                            let newEndDate = new Date(e.target.value)
                                            if (newEndDate.getTime() - startDate.getTime() > 0) {
                                                handleChangeTaskCreate('dayEnd', e.target.value)
                                            } else {
                                                alert("Có lỗi xảy ra! Hãy kiểm tra lại thời hạn công việc " + newTask.title)
                                            }
                                        }}
                                    >
                                    </input>
                                </div>
                                <div className={style.bar_row_item}>
                                    <p className={style.title_modal_input}>Trạng thái</p>
                                    <select
                                        onChange={e => handleChangeTaskCreate('status', transformState(parseInt(e.target.value) + 1))}
                                    >
                                        <option value="0">Đang làm</option>
                                        <option value="1">Hoàn thành</option>
                                        <option value="2">Quá hạn</option>
                                    </select>
                                </div>
                            </div>
                            <div className={`${style.modal_item_wrap} ${style.btn_crT}`}>
                                <button
                                    className={style.btn_crT_R}
                                    onClick={e => resetFieldCreate()}
                                >
                                    Reset
                                </button>
                                <button
                                    className={style.btn_crT_S}
                                    onClick={e => submitForm()}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </GlobalStyle>
    )
}

export default Header
import React, { useEffect, useMemo, useState } from 'react';
import style from "./Content.module.css";
import style2 from "../Header/Header.module.css"
import GlobalStyle from "../GlobalStyle";
import ScrollToTopButton from './ScrollToTop';

function Content() {
    const [list, SetList] = useState([]);
    const [baseList, SetBaseList] = useState([]);
    const [filterKey, SetFilterKey] = useState(0);
    const [isOpen, SetIsOpen] = useState(false);
    const [taskUpdate, setTaskUpdate] = useState({});
    const [filedUpdate, setFieldUpdate] = useState([]);

    const handleChangeTaskUpdate = (name, value) => {
        setTaskUpdate(prev => ({
            ...prev,
            [name]: value
        }));
        setFieldUpdate(prev => prev.filter(e => e.name === name).length === 0
            ? [...prev, {
                name: name,
                data: value
            }]
            : prev.map(e => {
                if (e.name === name) {
                    return {
                        name: name,
                        data: value
                    }
                }
                return e
            })
        )
    }

    const closeModal = () => {
        SetIsOpen(false)
    }

    // Cập nhật task
    const updateTask = async () => {
        let blank = false;
        Object.keys(taskUpdate).forEach(e => {
            if (taskUpdate[e] === "" && e !== "warn") {
                alert(`Thông tin ${e} không được để trống`);
                blank = true;
            }
        });
        if (!blank) {
            const confirmResult = window.confirm("Lưu thay đổi ?");

            if (confirmResult) {
                fetch('/updateTask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        taskId: taskUpdate.id,
                        field: filedUpdate
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status !== 'denined') {
                            SetBaseList(data.data);
                            closeModal();
                        }
                        else {
                            alert(`${data.data} bị trùng`)
                        }
                    });
            }
        }
    }

    // Nhấn enter 
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            updateTask();
        }
    }

    // Lấy dữ liệu list
    const fetchList = async () => {
        await fetch("/datalist", {
            method: "GET"
        }).then(res => res.json())
            .then(data => SetBaseList(data.data))
    }

    // Lấy điều kiện lọc
    const filterState = (value) => {
        if (value === 0) {
            SetList(baseList);
        }
        else {
            let newListState = baseList.filter(e => e.status === (transformState(parseInt(value))))
            SetList(newListState);
        }
    }

    // Search data
    const searchSomething = (character) => {
        let newListState = [];

        if (filterKey !== 0) {
            newListState = baseList.filter(e =>
                (e.title.toLowerCase().includes(character.toLowerCase()) || e.description.toLowerCase().includes(character.toLowerCase()))
                && (e.status === transformState(parseInt(filterKey)))
            ); // cai
        }
        else {
            newListState = baseList.filter(e =>
                (e.title.toLowerCase().includes(character.toLowerCase()) || e.description.toLowerCase().includes(character.toLowerCase()))
            );
        }
        SetList(newListState);
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

    const transformStateFromText = (stateValue) => {
        switch (stateValue) {
            case 'Đang làm':
                return 1;
            case 'Hoàn thành':
                return 2;
            case 'Quá hạn':
                return 3;
            default:
                return 0;
        }
    }

    // Đổi màu label trạng thái
    function getStatusColor(status) {
        switch (status) {
            case 'Hoàn thành':
                return '#7ede7e';
            case 'Quá hạn':
                return '#ff4f4f';
            case 'Đang làm':
                return '#f2d21e';
            default:
                return 'black';
        }
    }

    // Format ngày tháng theo yyyy-mm-dd
    function formatDate(date) {
        let formDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
        let res = date;

        if (!formDate.test(date)) {
            let year = date.substring(6, date.length);
            let month = date.substring(3, 5);
            let day = date.substring(0, 2);

            res = `${year}-${parseInt(month / 10)}${month % 10}-${parseInt(day / 10)}${day % 10}`;
        }

        return res;
    }

    // Mở popup
    const handlePopupUpdate = (id) => {
        setTaskUpdate(baseList.filter(e => e.id === id)[0]);
        setFieldUpdate([]);
        SetIsOpen(true);
    }

    // Delete task
    const handleDeleteTask = (taskId) => {
        const confirmResult = window.confirm("Công việc này sẽ bị xóa ?");
        if (confirmResult) {
            fetch('/deleteTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskId: taskId
                }),
            })
                .then(response => response.json())
                .then(data => {
                    SetBaseList(data.listTask)
                });
        }
    };

    useMemo(() => {
        SetList(filterKey !== 0
            ? baseList.filter(e => e.status === (transformState(filterKey)))
            : baseList)
    }, [baseList]);

    useMemo(() => {
        filterState(filterKey);
    }, [filterKey]);

    useEffect(() => {
        fetchList();
    }, [])

    return (
        <GlobalStyle>
            <div className={style.main_content}>
                <div className={style.wrap_content}>
                    <div className={style.wrap_search_box}>
                        <p>Sắp xếp theo</p>
                        <div className={style.select_wrap}>
                            <select onChange={e => SetFilterKey(parseInt(e.target.value))}>
                                <option value="0" defaultValue={true}>Tất cả công việc</option>
                                <option value="1">Đang làm</option>
                                <option value="2">Hoàn thành</option>
                                <option value="3">Quá hạn</option>
                            </select>
                        </div>
                        <div className={style.search_box}>
                            <input type='search' placeholder='Tìm kiếm' onChange={e => searchSomething(e.target.value)}></input>
                            <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
                        </div>
                    </div>
                    <div>
                        <ul>
                            {
                                list.length !== 0 ?
                                    list.map(task => (
                                        <li key={task.id}
                                            className={style.task_item}
                                        >
                                            <div className={style.wrap_title}>
                                                <p className={style.text_in}>{task.title}</p>
                                            </div>
                                            <div className={style.wrap_description}>
                                                <p className={style.lh_fix}>
                                                    {task.description}
                                                </p>
                                            </div>
                                            <div className={style.wrap_status}>
                                                <p className={style.p_title_col}>Trạng thái</p>
                                                <div
                                                    className={style.lh_fix}
                                                    style={{
                                                        backgroundColor: getStatusColor(task.status),
                                                        borderRadius: 15,
                                                        padding: 4
                                                    }}
                                                >
                                                    {task.status}
                                                </div>
                                            </div>
                                            <div className={style.wrap_item_res}>
                                                <div className={`${style.wrap_dayStart} ${style.fix_w_col_Name}`}>
                                                    <p className={style.p_title_col}>Bắt đầu</p>
                                                    <div className={style.lh_fix}>
                                                        {formatDate(task.dayStart)}
                                                    </div>
                                                </div>
                                                <div className={`${style.wrap_dayEnd} ${style.fix_w_col_Name}`}>
                                                    <p className={style.p_title_col}>Đến hạn</p>
                                                    <div className={style.lh_fix}>
                                                        {formatDate(task.dayEnd)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={style.btn_li_item}>
                                                <button
                                                    className={`${style.btn_i} ${style.btn_update}`}
                                                    onClick={e => handlePopupUpdate(task.id)}
                                                >Update</button>
                                                <button
                                                    className={`${style.btn_i} ${style.btn_delete}`}
                                                    onClick={e => handleDeleteTask(task.id)}
                                                >Delete</button>
                                            </div>
                                        </li>
                                    ))
                                    : <div className={style.img_not_found}>
                                        <img src="https://static.vecteezy.com/system/resources/previews/004/968/590/original/no-result-data-not-found-concept-illustration-flat-design-eps10-simple-and-modern-graphic-element-for-landing-page-empty-state-ui-infographic-etc-vector.jpg" alt="not found data" />
                                        <p>Dữ liệu không tồn tại</p>
                                    </div>
                            }
                        </ul>
                    </div>
                </div>
            </div>

            <ScrollToTopButton />

            {/* Update ở mỗi task  */}
            {
                isOpen && (
                    <div className={style2.modal}>
                        <div className={style2.overlay} onClick={closeModal}>
                        </div>
                        <div className={style2.modal_content_wrap}>
                            <div className={style2.addN_Close}>
                                <p>Update task</p>
                                <button onClick={closeModal}>
                                    <i className="fa-solid fa-x"></i>
                                </button>
                            </div>
                            <div className={style2.modal_content}>
                                <div className={style2.modal_item_wrap}>
                                    <p className={style2.title_modal_input}>Tiêu đề</p>
                                    <input
                                        type='text'
                                        value={taskUpdate.title}
                                        onChange={e => handleChangeTaskUpdate("title", e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        className={style2.input_text_modalbox}>
                                    </input>
                                </div>
                                <div className={`${style2.modal_item_wrap} ${style2.des_fix_height}`}>
                                    <p className={style2.title_modal_input}>Mô tả</p>
                                    <textarea
                                        type='text'
                                        value={taskUpdate.description}
                                        onChange={e => handleChangeTaskUpdate("description", e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        className={style2.input_text_modalbox}>
                                    </textarea>
                                </div>
                                <div className={`${style2.modal_item_wrap} ${style2.bar_row}`}>
                                    <div className={style2.bar_row_item}>
                                        <p className={style2.title_modal_input}>Ngày bắt đầu</p>
                                        <input
                                            type='date'
                                            value={formatDate(taskUpdate.dayStart)}
                                            onChange={e => handleChangeTaskUpdate("dayStart", e.target.value)}
                                        >
                                        </input>
                                    </div>
                                    <div className={style2.bar_row_item}>
                                        <p className={style2.title_modal_input}>Đến hạn</p>
                                        <input
                                            type='date'
                                            value={formatDate(taskUpdate.dayEnd)}
                                            onChange={e => {
                                                let startDate = new Date(formatDate(taskUpdate.dayStart));
                                                let newEndDate = new Date(e.target.value)
                                                if (newEndDate.getTime() - startDate.getTime() > 0) {
                                                    handleChangeTaskUpdate("dayEnd", e.target.value);
                                                } else {
                                                    alert("Có lỗi xảy ra! \n Hãy kiểm tra lại thời hạn công việc " + taskUpdate.title)
                                                }
                                            }}
                                        >
                                        </input>
                                    </div>
                                    <div className={style2.bar_row_item}>
                                        <p className={style2.title_modal_input}>Trạng thái</p>
                                        <select
                                            defaultValue={transformStateFromText(taskUpdate.status) - 1}
                                            onChange={e => handleChangeTaskUpdate("status", transformState(parseInt(e.target.value) + 1))}>
                                            <option value="0">Đang làm</option>
                                            <option value="1">Hoàn thành</option>
                                            <option value="2">Quá hạn</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={`${style2.modal_item_wrap} ${style2.btn_crT}`}>
                                    <button
                                        className={style2.btn_crT_R}
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className={style2.btn_crT_S}
                                        onClick={updateTask}
                                        onKeyDown={handleKeyPress}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </GlobalStyle>
    )
}

export default Content
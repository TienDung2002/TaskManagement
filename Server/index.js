const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/datalist', (req, res) => {
    fs.readFile("../src/assets/Components/Content/task_data.json", 'utf8',async  (err, data) => {
        if (err) throw err;

        let OldData = JSON.parse(data);

        res.status(200).json({
            status: "accepted",
            data: OldData
        })
    });
});

app.post('/createTask', async (req, res) => {
    /*
    body : {
        title: "",
        description: "",
        daystart,
        dayend,
        status,
    }
    response: {
        status: 200, 4xx,
        context: ""
    }
    */

    let TaskInfo = req.body;

    fs.readFile("../src/assets/Components/Content/task_data.json", 'utf8', (err, data) => {
        if (err) throw err;

        let OldData = JSON.parse(data);
        let sameTitle = false;

        OldData.forEach(e => {
            if(e.title === TaskInfo.title) sameTitle = true;
        })

        !sameTitle && OldData.push({ id: parseInt(OldData[OldData.length - 1].id) + 1, ...TaskInfo });

        let UpdateData = JSON.stringify(OldData, null, 2);

        fs.writeFile("../src/assets/Components/Content/task_data.json", UpdateData, (err) => {
            if (err) {
                console.error("err");
            }
        });

        res.status(200).json({
            status: !sameTitle ? "accepted" : 'denined',
            data: sameTitle && 'title'
        })

    });
})

app.post('/updateTask', async (req, res) => {
    /*
    body : {
        taskId: 12,
        field: [
            {
                name: "title",
                data: "daksfjasdnf"
            },
            {
                name: "description",
                data: "dasdfsfdas"
            }
        ]
    }
    response: {
        status: 200, 4xx,
        context: ""
    }
    */

    let TaskInfo = req.body;

    fs.readFile("../src/assets/Components/Content/task_data.json", 'utf8', (err, data) => {
        if (err) throw err;

        let OldData = JSON.parse(data);
        let sameTitle = false;

        OldData.forEach(e => {
            if(e.id === TaskInfo.taskId) {
                var UpdateTask = e;
                let title = TaskInfo.field.filter(f => f.name === 'title');

                title.length !== 0 && 
                OldData.filter(el => el.id !== TaskInfo.taskId).forEach(el => {
                    if(el.title === title[0].data) sameTitle = true 
                })

                !sameTitle 
                && TaskInfo.field.forEach(element => {
                    UpdateTask[element.name] = element.data
                })
            } 
        })

        let UpdateData = JSON.stringify(OldData, null, 2);

        fs.writeFile("../src/assets/Components/Content/task_data.json", UpdateData, (err) => {
            if (err) {
                console.error("err");
            }
        });

        res.status(200).json({
            status: !sameTitle ? "accepted" : 'denined',
            data: !sameTitle ? OldData : 'title'
        })

    });
});

app.post('/deleteTask', async (req, res) => {
    /*
    body : {
        taskId: 12
    }
    response: {
        status: 200, 4xx,
        context: ""
    }
    */

    let TaskInfo = req.body;

    fs.readFile("../src/assets/Components/Content/task_data.json", 'utf8',async  (err, data) => {
        if (err) throw err;

        let OldData = JSON.parse(data);

        OldData = OldData.reduce((acc, cur) => {
            if(cur.id !== TaskInfo.taskId) {
                acc.push({...cur});
            }
            return acc;
        }, []);

        let UpdateData = JSON.stringify(OldData, null, 2);

        fs.writeFile("../src/assets/Components/Content/task_data.json", UpdateData, (err) => {
            if (err) {
                console.error("err");
            }
        });

        res.status(200).json({
            status: "accepted",
            listTask: OldData
        })
    });

})

const port = 3001; // Choose a port number
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
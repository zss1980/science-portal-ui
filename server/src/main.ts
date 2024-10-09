import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import multer from 'multer'
import axios from 'axios'

const app = express();

app.use(cors());
app.use(express.json());
app.use(multer().any());

app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

app.get('/api', (_req, res) => {
  res.status(200).json({ message: 'Hello from the server!' });
});

app.post('/api/image', (_req, res) => {
    console.log(_req.body.cookie)
    axios.get('https://www.canfar.net/science-portal/image',{
        headers: {
            'Cookie': `CADC_SSO=${_req.body.cookie}`
        },
        withCredentials: true
    }).then(logRes => {
        console.log(logRes)
        res.status(200).json({ data: logRes.data });
        //res.status(500).json({ message: 'Fatal Error!!! Abort! Abort!! Abort!!!' });


    }).catch(rej =>{
            res.status(400).json({ message: rej.message });

    })

})

app.post('/api/userinfo', (_req, res) => {
    console.log('the body:', _req.body)
    axios.get('https://www.canfar.net/science-portal/userinfo',{
        headers: {
            'Cookie': `CADC_SSO=${_req.body.cookie}`
        },
        withCredentials: true
    }).then(logRes => {
        console.log(logRes)
        res.status(200).json({ data: logRes.data });

    }).catch(rej =>{
            res.status(400).json({ message: rej.message });

    })

})

app.post('/api/context', (_req, res) => {
    console.log(_req.body.cookie)
    axios.get('https://www.canfar.net/science-portal/context',{
        headers: {
            'Cookie': `CADC_SSO=${_req.body.cookie}`
        },
        withCredentials: true
    }).then(logRes => {
        console.log(logRes)
        res.status(200).json({ data: logRes.data });

    }).catch(rej =>{
            res.status(400).json({ message: rej.message });

    })

})


app.post('/api/session', (_req, res) => {
    console.log(_req.body.cookie)
    axios.get('https://www.canfar.net/science-portal/session',{
        headers: {
            'Cookie': `CADC_SSO=${_req.body.cookie}`
        },
        withCredentials: true
    }).then(logRes => {
        console.log(logRes)
        res.status(200).json({ data: logRes.data });
        //res.status(500).json({ message: 'Fatal Error!!! Abort! Abort!! Abort!!!' });

    }).catch(rej =>{
            res.status(400).json({ message: rej.message });

    })

})
app.post('/api/create_session', (_req, res) => {
    console.log(_req.body.cookie)
    console.log(_req.body)
    const payload: {
        type: string
        image: string
        name: string
        ram?: string
        cores?: string
    } = {
        type: _req.body.sessionType,
        image: _req.body.sessionImage,
        name: _req.body.sessionName,
    }

    if (_req.body.sessionType !== 'desktop') {
        payload.ram = _req.body.sessionRam
        payload.cores = _req.body.sessionCores
    }
    axios.post('https://www.canfar.net/science-portal/session',
      new URLSearchParams(payload),
      {
        headers: {
            'Cookie': `CADC_SSO=${_req.body.cookie}`
        },
        withCredentials: true
    }).then(logRes => {
        console.log(logRes)
        res.status(200).json({ data: logRes.data });
        //res.status(500).json({ message: 'Fatal Error!!! Abort! Abort!! Abort!!!' });

    }).catch(rej =>{
            res.status(400).json({ message: rej.response.data });

    })

})

app.delete('/api/delete_session', (_req, res) => {
    console.log(_req.body.cookie)
    axios.delete(`https://www.canfar.net/science-portal/session/${_req.body.sessionId}`,
      {
        headers: {
            'Cookie': `CADC_SSO=${_req.body.cookie}`
        },
        withCredentials: true
    }).then(logRes => {
        console.log(logRes)
        res.status(200).json({ data: logRes.data });
        //res.status(500).json({ message: 'Fatal Error!!! Abort! Abort!! Abort!!!' });

    }).catch(rej =>{
            res.status(400).json({ message: rej.response.data });

    })

})

app.post('/api/renew_session', (_req, res) => {
    console.log(_req.body.cookie)
    axios.post(`https://www.canfar.net/science-portal/session/${_req.body.sessionId}`,
      new URLSearchParams({action: 'renew'}),{
        headers: {
            'Cookie': `CADC_SSO=${_req.body.cookie}`
        },
        withCredentials: true
    }).then(logRes => {
        console.log(logRes)
        res.status(200).json({ data: logRes.data });
        //res.status(500).json({ message: 'Fatal Error!!! Abort! Abort!! Abort!!!' });

    }).catch(rej =>{
            res.status(400).json({ message: rej.response.data });

    })

})
app.post('/api/session_view', (_req, res) => {
    console.log(_req.body.cookie)
    axios.get('https://www.canfar.net/science-portal/session?view=stats',{
        headers: {
            'Cookie': `CADC_SSO=${_req.body.cookie}`
        },
        withCredentials: true
    }).then(logRes => {
        console.log(logRes)
        res.status(200).json({ data: logRes.data });
        //res.status(500).json({ message: 'Fatal Error!!! Abort! Abort!! Abort!!!' });

    }).catch(rej =>{
            res.status(400).json({ message: rej.message });

    })

})

app.post('/api/access/login', (_req, res) => {

    axios.post('https://www.canfar.net/access/login', new URLSearchParams({
  username: _req.body.username,
  password: _req.body.password,
}), {
    withCredentials: true
}).then(logRes => {
        console.log(decodeURIComponent(logRes.data))
        const cookie = decodeURIComponent(logRes.data).split('=')[1] + '='
        res.status(200).json({ cookie, message: 'Logged in' });

}
    ).catch(rej => {
            res.status(400).json({ message: rej.message });

    })
    
  });
app.post('/api/access/logout', (_req, res) => {
    axios.get('https://www.canfar.net/access/logout',{
        headers: {
            'Cookie': `CADC_SSO=${_req.body.cookie}`
        },
        withCredentials: true
    }).then(logRes => {
        console.log(logRes)
        res.status(200).json({ data: logRes.data });
        //res.status(500).json({ message: 'Fatal Error!!! Abort! Abort!! Abort!!!' });

    }).catch(rej =>{
        res.status(400).json({ message: rej.message });

    })

})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
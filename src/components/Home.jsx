import React, { useState, useEffect } from "react";
import * as FirestoreService from '../services/RealtimeDatabase';
import { Button, Container, Grid } from "@material-ui/core";
import moment from "moment";
import { useHistory } from "react-router-dom";
import Paper from '@material-ui/core/Paper';

import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';


export default function Home() {
    document.title = 'Work To Day';
    const [userCheckData, setCheckUserData] = useState([])
    const [fetchIP, setFetchIP] = useState([])
    const [fetchMACAddress, setFetchMACAddress] = useState()
    const [workingTime, setWorkingTime] = useState()
    const [timeming] = useState(moment())
    const [timemingCheckOut, setTimemingCheckOut] = useState(false)
    const history = useHistory();

    const onCheckIn = (dataUri) => {
        FirestoreService.setCheckIn(fetchIP, fetchMACAddress, workingTime, dataUri)
        // setTimeout(() => {
        //     history.go()
        // }, 10000);
    }
    const onCheckOut = (dataUri) => {
        setTimemingCheckOut(true)
        FirestoreService.setCheckOut(chkData?.[0], workingTime, dataUri)
        // setTimeout(() => {
        //     history.go()
        // }, 60000);
    }

    FirestoreService.fetchIP().then(e => setFetchIP(e))
    FirestoreService.fetchMacAddress().then(e => setFetchMACAddress(e))

    useEffect(() => {
        if (localStorage.getItem('login_check') !== '2.0.1') {
            history.push('login')
        }
    })

    useEffect(() => {
        FirestoreService.getCheckInUsers().orderByValue().on("value", snapshot => {
            const array = [];
            // For each data in the entry
            snapshot.forEach(el => {
                // Push the object to the array
                // If you also need to store the unique key from firebase,
                // You can use array.push({ ...el.val(), key: el.key });
                array.push(el.val());
            });
            setCheckUserData(array);
        });
        FirestoreService.getWorkingTime().on("value", snapshot => {
            const array = [];
            snapshot.forEach(el => {
                array.push(el.val());
            });
            setWorkingTime(array);
        })
    }, [])

    const chkData = [userCheckData.reverse().find(({ check_out }) => check_out === '') || 0]

    if (chkData?.[0]?.check_in) {
        if (moment().diff(moment(chkData?.[0]?.check_in), 'hours') > 14) {
            FirestoreService.setCheckOutNoLine(chkData?.[0]).then(() => history.go())
        }
    }

    function handleTakePhotoChkIn(dataUri) {
        // Do stuff with the photo...
        console.log('takePhoto', dataUri);
        onCheckIn(dataUri)
    }
    function handleTakePhotoChkOut(dataUri) {
        // Do stuff with the photo...
        console.log('takePhoto', dataUri);
        onCheckOut(dataUri)
    }

    return (
        <>
            <br />
            <Container maxWidth="xs">
                {/* <CheckIn CheckInData={chkData} /> */}
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    spacing={3}>
                    <Grid item xs>
                        <Paper elevation={6}><h1 style={{ textAlign: '-webkit-center', paddingTop: '20px', paddingBottom: '20px' }}>{timeming.format('HH')}</h1></Paper>
                    </Grid>
                    <h1>:</h1>
                    <Grid item xs>
                        <Paper elevation={6}><h1 style={{ textAlign: '-webkit-center', paddingTop: '20px', paddingBottom: '20px' }}>{timeming.format('mm')}</h1></Paper>
                    </Grid>
                    <h1>:</h1>
                    <Grid item xs>
                        <Paper elevation={6}><h1 style={{ textAlign: '-webkit-center', paddingTop: '20px', paddingBottom: '20px' }}>{timeming.format('ss')}</h1></Paper>
                    </Grid>
                </Grid>
                <><h2 style={{ marginTop: '7vh' }} align='center'>{localStorage.getItem('login_firstname')} {localStorage.getItem('login_lastname')}</h2></>
                {chkData?.[0]?.check_in && !chkData?.[0]?.check_out ? <><h2 style={{ marginTop: '7vh' }} align='center'>เข้างานเวลา {moment(chkData?.[0]?.check_in).format('HH:mm')} นาที</h2></> : <><h2 style={{ marginTop: '7vh' }} align='center'>ยังไม่ได้บันทึกการเข้างาน</h2></>}
            </Container>


            {/* 
            <Camera
                onTakePhoto={(dataUri) => { handleTakePhoto(dataUri); }}
            />

            {fetchIPAddress.find(({ ip }) => ip === fetchIP)?.ip ? <p></p> : !timemingCheckOut ? (chkData?.[0]?.check_in && (moment().diff(moment(chkData?.[0]?.check_in), 'seconds') < 18000)) ?
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="inherit"
                    style={{ bottom: 0, position: 'fixed' }}
                >
                    Warnning Check In
                </Button> :
                chkData?.[0]?.check_in && !chkData?.[0]?.check_out ? <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={onCheckOut}
                    style={{ bottom: 0, position: 'fixed' }}
                >
                    Check Out
                </Button> : <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={onCheckIn}
                        style={{ bottom: 0, position: 'fixed' }}
                    >
                        Check In
                </Button> : <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="inherit"
                    style={{ bottom: 0, position: 'fixed' }}
                >
                    Warnning Check Out
                </Button>
            } */}

            {!timemingCheckOut ? (chkData?.[0]?.check_in && (moment().diff(moment(chkData?.[0]?.check_in), 'seconds') < 18000)) ?
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="inherit"
                    style={{ bottom: 0, position: 'fixed' }}
                >
                    Warnning Check In
                </Button> :
                chkData?.[0]?.check_in && !chkData?.[0]?.check_out ? <Camera
                    onTakePhoto={(dataUri) => { handleTakePhotoChkOut(dataUri); }}
                    idealFacingMode={FACING_MODES.USER}
                    idealResolution={{ width: 200 }}
                    imageType={IMAGE_TYPES.JPG}
                    imageCompression={1}
                    isMaxResolution={false}
                    isImageMirror={false}
                    isSilentMode={false}
                    isDisplayStartCameraError={true}
                    isFullscreen={false}
                    sizeFactor={0.9}
                /> : <Camera
                        onTakePhoto={(dataUri) => { handleTakePhotoChkIn(dataUri); }}
                        idealFacingMode={FACING_MODES.USER}
                        idealResolution={{ width: 200 }}
                        imageType={IMAGE_TYPES.JPG}
                        imageCompression={1}
                        isMaxResolution={false}
                        isImageMirror={false}
                        isSilentMode={false}
                        isDisplayStartCameraError={true}
                        isFullscreen={false}
                        sizeFactor={0.9}
                    /> : <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="inherit"
                        style={{ bottom: 0, position: 'fixed' }}
                    >
                    Warnning Check Out
                </Button>
            }
        </>
    );
}
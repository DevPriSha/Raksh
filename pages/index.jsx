import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import moment from 'moment';
import TempGauge from "../components/ui/LiveData/TempGauge";
import HumidityGauge from "../components/ui/LiveData/HumidityGauge";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Layout from "../Layout/Layout"
import EarthquakeEntries from '../models/EarthquakeEntries';
import db from '../utils/db';
import DatePickerComponent from "../components/DatePickerComponent/DatePickerComponent";
import { useRouter } from 'next/router'
import Button from "@mui/material/Button";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useSnackbar } from 'notistack';
import { ResponsiveContainer } from "recharts"
import { Line } from "react-chartjs-2";
export default function TempHumLiveData({ entries }) {

  const router = useRouter()
  const { id } = router.query

  useEffect(() => {

    chartDataFilter()
  }, [router]);

  setTimeout(function () {
    if (window !== undefined) {
      // browser code
      window.location.reload(1);
    }
  }, 300000);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const currentDate = new Date()
  currentDate.setHours(0, 0, 0);
  const [startDate, SetStartDate] = useState(moment(currentDate, "YYYY-MM-DDTHH:mm:ss").format("YYYY-MM-DD"));
  const [endDate, SetEndDate] = useState(moment(currentDate, "YYYY-MM-DDTHH:mm:ss").add(1, 'days').format("YYYY-MM-DD"));
  const [fetchedData, SetFetchedData] = useState({ "accelerationXData": [], "accelerationYData": [], "accelerationZData": [], "rotationXData": [], "rotationYData": [], "rotationZData": [], "tempData": [] });

  async function chartDataFilter() {
    closeSnackbar()
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_Chart_API_Python_Link}`, {
        start_date: startDate,
        end_date: endDate,
        deviceID: 1
      });
      console.log("data", data);
      SetFetchedData(data)
      enqueueSnackbar('Filtered', { variant: 'success' });
    }
    catch (e) {
      console.log(e)
    }
  }




  const earthquakedata = {
    labels: ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"],
    datasets: [
      {
        label: "Rotation in X",
        data: fetchedData.accelerationXData.maxArray,
        borderColor: [
          "red",
        ],
        borderWidth: 1,
      },
      {
        label: "Rotation in Y",
        data: fetchedData.accelerationYData.maxArray,
        borderColor: [
          "green",
        ],
        borderWidth: 1,
      },
      {
        label: "Rotation in Z",
        data: fetchedData.accelerationZData.maxArray,
        borderColor: [
          "violet",
        ],
        borderWidth: 1,
      }
    ],
  };



  const rotationdata = {
    labels: ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"],
    datasets: [
      {
        label: "Acceleration in X",
        data: fetchedData.rotationXData.maxArray,
        borderColor: [
          "red",
        ],
        borderWidth: 1,
      },
      {
        label: "Acceleration in Y",
        data: fetchedData.rotationYData.maxArray,
        borderColor: [
          "green",
        ],
        borderWidth: 1,
      },
      {
        label: "Acceleration in Z",
        data: fetchedData.rotationZData.maxArray,
        borderColor: [
          "violet",
        ],
        borderWidth: 1,
      }
    ],
  };



  return (
    <Layout>
      <Grid container>

        <Stack style={{ width: '100%' }} alignItems="center"
          justifyContent="center" direction='row'>
          <DatePickerComponent
            startDate={startDate}
            SetStartDate={SetStartDate}
            endDate={endDate}
            SetEndDate={SetEndDate}
          />
          <Button onClick={() => chartDataFilter()} endIcon={<FilterAltIcon />}
            style={{ backgroundColor: '#FF5C93', borderRadius: '1rem', borderRadius: '1rem', color: 'white', marginTop: '1rem', marginBottom: '1rem', padding: '0.7rem' }} >
            <b>  Click To Filter</b>
          </Button>

        </Stack>


        {entries?.map((element) => {
          return (<>

            <Grid container spacing={2}>
              <Grid item sm={12} md={4}>
                <div style={{ border: "2px solid #9013FE", borderRadius: "1rem" }} >
                  <ResponsiveContainer className="p-0" width="100%" height="100%">
                    <>
                      <div
                        className="p-1"
                        style={{
                          backgroundColor: "#9013FE",
                          borderRadius: "1rem",
                          color: "#fff",
                          textAlign: "center",
                        }}
                      >
                        <h5>Acceleration Trend</h5>
                      </div>
                      <div style={{ padding: "3px" }}>
                        <Line
                          height={150}
                          data={earthquakedata}
                        />
                      </div>
                    </>
                  </ResponsiveContainer>
                </div>
              </Grid>
              <Grid item sm={12} md={4}>
                <div style={{ border: "2px solid #9013FE", borderRadius: "1rem" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <>
                      <div
                        className="p-1"
                        style={{
                          backgroundColor: "#9013FE",
                          borderRadius: "1rem",
                          color: "#fff",
                          textAlign: "center",
                        }}
                      >
                        <h5>Rotation Trend</h5>
                      </div>
                      <div style={{ padding: "3px" }}>
                        <Line
                          height={150}
                          data={rotationdata}
                        />
                      </div>
                    </>
                  </ResponsiveContainer>
                </div>
              </Grid>
              <Grid
                key={element.deviceID}
                component={Paper}
                style={{ border: "2px solid #9013FE", borderRadius: "1rem" }}
                className="p-0"
                item
                lg={4}
                md={4}
                sm={6}
                xs={12}
              >
                <ResponsiveContainer className="p-0" width="100%">
                  <>
                    <div
                      className="p-1"
                      style={{
                        backgroundColor: "#9013FE",
                        borderRadius: "1rem",
                        color: "#fff",
                        textAlign: "center",
                      }}
                    >
                      <h5>{element.deviceName}</h5>
                    </div>
                    <Typography variant="h6" align="center" >Temperature:</Typography>
                    <TempGauge value={element.temperature} />
                    <Typography fontWeight={800} variant="h5" align="center" >{parseFloat(element.temperature).toFixed(2)} °C</Typography>






                  </>
                </ResponsiveContainer>
              </Grid>
            </Grid>


          </>)
        })}


      </Grid>
    </Layout >
  );
}

export async function getServerSideProps() {
  await db.connect();
  // Array of all devices in entries collection
  const devices = await EarthquakeEntries.find({}).distinct('deviceName').lean()
  await db.disconnect();

  var array = new Array();
  for (const item of devices) {
    // finding last entries of all devices and pushing in an Array
    await db.connect();
    let x = await EarthquakeEntries.find({ deviceName: item }).sort({ _id: -1 }).limit(1).lean()
    await db.disconnect();
    array.push(x.map(db.convertDocToObj)[0])
  }
  return {
    props: {
      entries: array,
    },
  };
}


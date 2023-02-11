import React, { useContext} from "react";
import { ResponsiveContainer } from "recharts";
import TempGauge from "../components/ui/LiveData/TempGauge";
import HumidityGauge from "../components/ui/LiveData/HumidityGauge";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Layout from "../Layout/Layout"
import Entries from '../models/Entries';
import db from '../utils/db';
export default function TempHumLiveData({ entries }) {

  setTimeout(function () {
    if (window !== undefined) {
      // browser code
      window.location.reload(1);
    }
  }, 300000);


  return (
    <Layout>
      <Grid container>

        {entries?.map((element) => {
          return (<>

            <Grid
            key={element.devEUI}
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
                  <Grid sx={{ p: 2 }} container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="h6" align="center" >Temperature:</Typography>


                      <div style={{ position: 'relative', left: '-5.4rem' }}>
                        <TempGauge value={element.temperature} />
                      </div>
                      <Typography fontWeight={800} variant="h5" align="center" >{parseFloat(element.temperature).toFixed(2)} °C</Typography>



                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" align="center" >Humidity:</Typography>

                      <div style={{ position: 'relative', left: '-6rem' }}>
                        <HumidityGauge value={element.humidity} />
                      </div>
                      <Typography fontWeight={800} variant="h5" align="center" >{parseFloat(element.humidity).toFixed(2)} %</Typography>

                    </Grid>

                  </Grid>

                </>
              </ResponsiveContainer>
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
  const devices = await Entries.find({}).distinct('deviceName').lean()
  await db.disconnect();

  var array = new Array();
  for (const item of devices) {
    // finding last entries of all devices and pushing in an Array
    await db.connect();
    let x = await Entries.find({ deviceName: item }).sort({ _id: -1 }).limit(1).lean()
    await db.disconnect();
    array.push(x.map(db.convertDocToObj)[0])
  }
  return {
    props: {
      entries: array,
    },
  };
}


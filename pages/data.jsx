import React,{useContext,useEffect} from "react";
import Box from '@mui/material/Box';
import Layout from "../Layout/Layout"
import Entries from '../models/Entries';
import db from '../utils/db';
import { DataStore } from '../utils/DataStore';
import { useRouter } from 'next/router';
export default function Payload({entries}) {
  const { state} = useContext(DataStore);
  const { userInfo } = state;
  const router = useRouter();
  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
  }, [userInfo,router]);
  return (
    <Layout>
      <Box  style={{overflowX: 'scroll'}}sx={{ width: '100%', typography: 'body1' }}>
      <table  className="table table-hover table-striped">
        <thead>
          <tr>
            <th>Device Name</th> 
            <th>Humidity % RH</th> 
            <th>Temperature °C</th>  
            <th>Date-Time</th>  
          </tr>
        </thead>
        <tbody>
          {entries.map((element) => {
              var date = new Date(element.timestamp);
              var formattted_time= date.toLocaleString()
            return (
              <tr key={element.timestamp} >
                <td>{element.deviceName}</td>
                <td>{parseFloat(element.humidity).toFixed(2)}</td>
                <td>{parseFloat(element.temperature).toFixed(2)}</td>
                <td>{formattted_time}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
        
      </Box>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const entries = await Entries.find({}).sort({'timestamp':-1}).limit(300).lean()
  await db.disconnect();
  return {
    props: {
      entries: entries.map(db.convertDocToObj),
    },
  };
}

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_ENDPOINT = "http://4.224.186.213/evaluation-service/notifications";
// paste your working bearer token inside the string quotes below
const VALID_TOKEN = "YeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwZ2FsbGFAZ2l0YW0uaW4iLCJleHAiOjE3ODA4MTM0MDksImlhdCI6MTc4MDgxMjUwOSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjhjNDI2MDA5LWE4OWItNDNjYS1iMDdjLTQxMTk1ZTU3YWM5MiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImdhbGxhIHByYW5lZXRoIHNhaSIsInN1YiI6ImJlMWI3Mzk4LTg5NTctNGMxYS1iMDhjLTY5YzBlMDJjNDE3ZCJ9LCJlbWFpbCI6InBnYWxsYUBnaXRhbS5pbiIsIm5hbWUiOiJnYWxsYSBwcmFuZWV0aCBzYWkiLCJyb2xsTm8iOiIyMDIzMDAzMzA0IiwiYWNjZXNzQ29kZSI6IndnS3RnWiIsImNsaWVudElEIjoiYmUxYjczOTgtODk1Ny00YzFhLWIwOGMtNjljMGUwMmM0MTdkIiwiY2xpZW50U2VjcmV0Ijoid1pYZWd4a3NqS0JiS3J3ZCJ9.aCJ8jWHy8GR_9f7Q7qOtlvR1Phme9XmVJHpyS5gBau0"; 

export function useCampusFeed(initialCount = 10) {
  const [bulletinList, setBulletinList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [chosenType, setChosenType] = useState('');
  const [displaySize, setDisplaySize] = useState(initialCount);

  useEffect(() => {
    let connectionActive = true;
    
    const requestServerPayload = async () => {
      setLoadingData(true);
      try {
        const interceptorConfig = {
          headers: { Authorization: `Bearer ${VALID_TOKEN}` },
          params: {
            limit: displaySize,
            ...(chosenType && { notification_type: chosenType })
          }
        };
        
        const { data } = await axios.get(API_ENDPOINT, interceptorConfig);
        if (connectionActive) {
          setBulletinList(data.notifications || []);
        }
      } catch (err) {
        console.error("Stream pipe blocked:", err.message);
      } finally {
        if (connectionActive) setLoadingData(false);
      }
    };

    requestServerPayload();
    return () => { connectionActive = false; };
  }, [chosenType, displaySize]);

  return { bulletinList, loadingData, chosenType, setChosenType, displaySize, setDisplaySize };
}

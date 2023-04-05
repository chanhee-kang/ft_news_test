import CountryList from '../components/CountryList';
import { Grid, TextField, Button } from '@material-ui/core';
import { supabase } from '../lib/initSupabase';
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';


export default function Home() {
  const [showTextField, setShowTextField] = useState(false);
  const [textValue, setTextValue] = useState("");
  const toggleTextField = () => {
    setShowTextField(!showTextField);
  };

  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([textValue], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "FinancialTimes요약.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleTextAreaChange = (event) => {
    setTextValue(event.target.value);
  };

  return (
    <main>
      <header style={{backgroundColor: "white"}}>
      <div className="header-left">
        <a href="#" className="header-logo">Financial Times 뉴스 요약</a>
        
      </div>
      <div className="header-right">
        <Button variant="contained" color="primary" onClick={toggleTextField}>
          {showTextField ? "Hide Text Field" : "Show Text Field"}
          </Button>
         
      </div>
    </header>
    <div height ="10"></div>
  
      <Grid container spacing={3}>
        <Grid item xs={12} md={showTextField ? 7 : 12}>
          <CountryList />
        </Grid>
        <Grid item xs={12} md={showTextField ? 5 : 0}>
          {showTextField && (
            <>
              <TextField
                label="My Text Area"
                name="myTextArea"
                multiline
                rows={30}
                variant="outlined"
                fullWidth
                id="myTextArea"
                value={textValue}
                onChange={handleTextAreaChange}
              />
              <Button variant="contained" color="primary" onClick={downloadTxtFile}>
                Download as .txt
              </Button>
            </>
          )}
          
        </Grid>
      </Grid>
    </main>
  );
}
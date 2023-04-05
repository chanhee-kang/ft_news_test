import { useEffect, useState } from 'react';
import { supabase } from '../lib/initSupabase';
import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const XLSX = require('xlsx');

const columns = [
  { field: 'title', headerName: '제목', width: 600 },
  { field: 'type', headerName: '타입', width: 120 },
  { field: 'dates', headerName: '날짜', width: 150 },
  { field: 'en_summary', headerName: '영문요약', width: 500 },
  { field: 'ko_summary', headerName: '국문요약', width: 500 },
  { field: 'link', headerName: '링크', width: 200 },
];

export default function CountryList() {
  const [countries, setCountries] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  let dateObj = new Date();
  let options = {timeZone: "Asia/Seoul"};
  let dateString = dateObj.toLocaleString("en-US", options).slice(0, 10);

  const [value, setValue] = useState(dayjs(dateString));
  
  const handleRowClick = (params) => {
    setSelectedRow(params.row);
  };

  const handleClose = () => {
    setSelectedRow(null);
  };


  const dValue = value.$d
  const test = `${dValue.getFullYear()}-${(dValue.getMonth()+1).toString().padStart(2, '0')}-${dValue.getDate().toString().padStart(2, '0')}`

  const excelDownload = () => {
    const headers = ['title', 'type', 'dates', 'en_summary', 'ko_summary', 'link'];
  
    const desiredFields = countries.map(obj => {
      return {
        title: obj.title,
        type: obj.type,
        dates: obj.dates,
        en_summary: obj.en_summary,
        ko_summary: obj.ko_summary,
        link: obj.link,
      };
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(desiredFields, { header: headers });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `FT_${test}.xlsx`);
  }
  
  useEffect(() => {
    const fetchCountries = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data: countries } = await supabase
        .from('ft_news')
        .select('*')
        .eq('keyDate', test)
      setCountries(countries);
    };
    fetchCountries();
  }, [test])

  return (
    <>

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="calender"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </LocalizationProvider>

      <Button
        variant="contained"
        color="primary"
        onClick={excelDownload}
        style={{ marginLeft: '16px' }} // Optional styling to add some space between the two components
      >
        엑셀 다운로드
      </Button>
    </div>
    
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={countries}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        onRowClick={handleRowClick}
      />
      {selectedRow && (      
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 100,
            
          }}
          onClick={handleClose}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#fff',
              padding: 20,
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>▲{selectedRow.title}</h3>
            <p>{selectedRow.dates}</p>
            <p><strong>영문요약</strong></p>
            <p>{selectedRow.en_summary}</p>
            <p><strong>국문요약</strong></p>
            <p>{selectedRow.ko_summary}</p>
            <p><strong>원본링크</strong></p>
            <a href={selectedRow.link} rel="noreferrer" target="_blank">{selectedRow.link}</a>
            <p><strong>타입 </strong></p>
            <p>{selectedRow.type}</p>
            
          </div>
        </div>
      )}
    </div>
    </>
  );
}
import { useEffect, useState } from 'react';
import { supabase } from '../lib/initSupabase';
import { Button, Box } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { SiMicrosoftexcel } from "react-icons/si";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';




const XLSX = require('xlsx');

const columns = [
  { field: 'title', headerName: '제목', width: 800, },
  { field: 'type', headerName: '타입', width: 120 },
  { field: 'dates', headerName: '날짜', width: 150 },
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
  const TopWords = () => {
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
  const TopWordsChart = ({ data,test }) => {
    const chartColors = ['#0070C0'];
    return (
      <BarChart width={600} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="word" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="frequency" fill="#000033" />
      </BarChart>
    );
  };
  
  // const dValue = value.$d
  // const test = `${dValue.getFullYear()}-${(dValue.getMonth()+1).toString().padStart(2, '0')}-${dValue.getDate().toString().padStart(2, '0')}`
  
  useEffect(() => {
    const fetchCountries = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data: countries } = await supabase
        .from('top_words')
        .select('*')
        .eq('dates', test)
      setCountries(countries);
    };
    fetchCountries();
  }, [test])



  const data = countries.map((item) => {
    const [word, frequency] = JSON.parse(item.top_words);
    return { word, frequency };
  });

  return (
    <>
      <TopWordsChart data={data} />
    </>
  );
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

  const countriess = countries.map(obj => {
    const EN_summary = obj.en_summary.replace(/- /g, '<br>- ');
    const KO_summary = obj.ko_summary.replace(/- /g, '<br>- ');
    const ClearBody = obj.body.replace(/[^a-zA-Z0-9\s]/g, '');

    return {
      id : obj.id,
      title: obj.title,
      type: obj.type,
      dates: obj.dates,
      en_summary: EN_summary,
      ko_summary: KO_summary,
      link: obj.link,
      body: ClearBody,
    };
  });

  return (
    <>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={value}
            onChange={(newValue) => setValue(newValue)}
            sx={{
              width: '200px',
              '& ': {
                width: 180,
              },
            }}
          />
        </LocalizationProvider>

        <Button
          onClick={excelDownload}
          style={{ height: '55px', backgroundColor: 'white', border: '1px solid #C0C0C0' }}
        >
          <SiMicrosoftexcel color="#247967" size={28} />
        </Button>
      </Box>

    <Box style={{ height:'20px' }} />
    
    <Box style={{ height: 700, width: '100%' }}>
      <DataGrid
        rows={countriess}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[10]}
        onRowClick={handleRowClick}
        getRowClassName={(params) => 'custom-row-class'}
      />
      {selectedRow && (      
        <Box
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
          <Box
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#fff',
              padding: 20,
              overflowY: 'auto',
              maxHeight: '80vh', // Set a maximum height for scrolling
              minWidth: 1000, // Set a maximum width if needed
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h4">▲{selectedRow.title}</Typography>
                      <Typography variant="subtitle1">
                        <strong>날짜</strong> : {selectedRow.dates}</Typography>
                    </TableCell>
                  </TableRow>
                  
                  </TableHead>
                <TableBody>
                  
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1">
                        <strong>영문요약</strong>
                      </Typography>
                      <Typography dangerouslySetInnerHTML={{ __html: selectedRow.en_summary }}></Typography>

                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1">
                        <strong>국문요약</strong>
                      </Typography>
                      <Typography dangerouslySetInnerHTML={{ __html: selectedRow.ko_summary }}></Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1">
                        <strong>원본링크</strong>
                      </Typography>
                      <Link href={selectedRow.link} rel="noreferrer" target="_blank">
                        {selectedRow.link}
                      </Link>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1">
                        <strong>타입</strong>
                      </Typography>
                      <Typography>{selectedRow.type}</Typography>
                    </TableCell>
                  </TableRow>

                  {/* <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1">
                        <strong>본문</strong>
                      </Typography>
                      <Typography>{selectedRow.body}</Typography>
                    </TableCell>
                  </TableRow> */}

                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      )}
    </Box>
    {/* <Box style={{ height:'20px' }} /> */}
    {/* <Box style={{ height:'40px', fontSize: '24px',marginLeft : "20px" }}>
        Financial Times Today's Tow words
    <Box style={{ height:'20px' }} />
    <TopWords />
    </Box> */}


    </>
  );
}
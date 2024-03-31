import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DataTable from "../components/table.js";
import { Button, Modal, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Alert } from '@mui/material';
import "./records.css";

const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'domain', headerName: 'Domain', flex: 2 },
    { field: 'ttl', headerName: 'TTL', flex: 2 },
    { field: 'rtype', headerName: 'Type', flex: 2 },
    { field: 'rdata', headerName: 'RDATA', flex: 3 },
    { field: 'state', headerName: 'State', flex: 2 }
];

export default function Records() {
    const { compartmentID,ocid, name } = useParams();
    const [records, setRecords] = useState([]);
    const [open, setOpen] = useState(false);
    const [domain, setDomain] = useState('');
    const [ttl, setTTL] = useState('');
    const [rtype, setRType] = useState('');
    const [rdata, setRData] = useState('');
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const host = process.env.REACT_APP_HOST;

    const callRecord = () => {
        
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleCancel = () => {
        setOpen(false);
        // Reset field values
        setDomain('');
        setTTL('');
        setRType('');
        setRData('');
    }

    const handleCreate = async () => {
        // Validate if any required field is empty
        if (!domain || !ttl || !rtype || !rdata) {
            console.error("All fields are required");
            return;
        }

        try {
            const response = await axios.post(`${host}/createrecord/${ocid}/${compartmentID}`, {
                domain,
                ttl,
                rtype,
                rdata
            });
            console.log(response.data);
            setOpen(false);
            setDomain('');
            setTTL('');
            setRType('');
            setRData('');
            fetchRecords();
        } catch (error) {
            console.error('Error creating record:', error);
            setErrorMessage(`Error creating record: ${error.message}`);
            setErrorAlert(true);
        }
    }

    const fetchRecords = async () => {
        try {
            const response = await axios.get(`${host}/zoneRecords/${ocid}/${name}/${compartmentID}`);
            const recordsData = response.data.data.recordCollection.items;
            const formattedRows = recordsData.map((record, index) => ({
                id: index + 1,
                domain: record.domain,
                ttl: record.ttl,
                rtype: record.rtype,
                rdata: record.rdata,
                state: "created",
              }));
            setRecords(formattedRows); // Assuming response.data is an array of records
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    }

    useEffect(() => {
        fetchRecords();
    }, [ocid, name]);

    return (
        <div className="component-container">
            <h1>Record Details</h1>
            <p>Domain: {name}</p>
            {errorAlert && <Alert severity="error">{errorMessage}</Alert>}
            <DataTable add="RECORDS" addRecord={handleOpen} showRecords={callRecord} cols={columns} rows={records} />
            <Modal open={open} onClose={handleCancel}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
                    <TextField label="Domain" value={domain} onChange={(e) => setDomain(e.target.value)} fullWidth />
                    <TextField label="TTL" value={ttl} onChange={(e) => setTTL(e.target.value)} fullWidth />
                    <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={rtype}
                            onChange={(e) => setRType(e.target.value)}
                        >
                            <MenuItem value="A">A (Address) Record</MenuItem>
                            <MenuItem value="AAAA">AAAA (IPv6 Address) Record</MenuItem>
                            <MenuItem value="CNAME">CNAME (Canonical Name) Record</MenuItem>
                            <MenuItem value="MX">MX (Mail Exchange) Record</MenuItem>
                            <MenuItem value="NS">NS (Name Server) Record</MenuItem>
                            <MenuItem value="PTR">PTR (Pointer) Record</MenuItem>
                            <MenuItem value="SOA">SOA (Start of Authority) Record</MenuItem>
                            <MenuItem value="SRV">SRV (Service) Record</MenuItem>
                            <MenuItem value="TXT">TXT (Text) Record</MenuItem>
                            <MenuItem value="DNSSEC">DNSSEC</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField label="RDATA" value={rdata} onChange={(e) => setRData(e.target.value)} fullWidth />
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleCreate}>Create</Button>
                </div>
            </Modal>
        </div>
    )
}
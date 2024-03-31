import { useState, useEffect } from "react";
import {useNavigate,useParams} from "react-router-dom";
import axios from "axios";
import DataTable from "../components/table.js";
import { Button, Modal, TextField, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import "./zones.css";

const columns = [
  { field: 'id', headerName: 'ID', flex: 1, headerClassName: 'column-header' },
  { field: 'domain', headerName: 'Domain', flex: 2, headerClassName: 'column-header' },
  { field: 'zonetype', headerName: 'Zone Type', flex: 2, headerClassName: 'column-header' },
  { field: 'scope', headerName: 'Scope', flex: 2, headerClassName: 'column-header' },
  { field: 'isprotected', headerName: 'Is Protected', flex: 2, headerClassName: 'column-header' }
];

export default function Zones() {
  const navigate = useNavigate();
  const {compartmentID} = useParams();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState('');
  const [zoneType, setZoneType] = useState('');
  const [error, setError] = useState(null);

  const host = process.env.REACT_APP_HOST;

  const handleCancel = () => {
    setOpen(false);
    setDomain('');
    setZoneType('');
    setError(null);
}

const handleCreate = async () => {
  const domainRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;

    if (!domain || !zoneType || !domain.match(domainRegex)) {
        setError("Please fill in all required fields with a valid domain name (e.g., example.com)");
        return;
    }

  try {
      await axios.post(`${host}/createzone`, { domain, zoneType, compartmentID });
      setOpen(false);
      setDomain('');
      setZoneType('');

      setError(null);
      fetchZones();
  } catch (error) {
      console.error('Error creating zone:', error);
  }
}

const handleOpenModal = () => {
  setOpen(true);
}

const handleCloseModal = () => {
  setOpen(false);
  setError(null);
}


  const callRecords = (ocid,name)=> {
    navigate('/' + compartmentID + '/records/' + ocid + '/' + name);
  }

  const handleDelete = async (ocid) => {
    console.log("Clicked handle Delete")
    try {
      const response = await axios.delete(`${host}/deletezone/${ocid}/${compartmentID}`)
      console.log(response.data.data);
    } catch (error) {
      console.error("Error while deleting Zone: " , error);
    }
  }

  const fetchZones = async () => {
    try {
      const response = await axios.get(`${host}/zonelist/${compartmentID}`);
      const zonesData = response.data.data.items;
      // Map the zones data to format it into rows
      const formattedRows = zonesData.map((zone, index) => ({
        id: index + 1,
        domain: zone.name,
        zonetype: zone.zoneType,
        scope: zone.scope,
        isprotected: zone.isProtected ? "True" : "False",
        ocid: zone.id,
      }));

      setRows(formattedRows);
    } catch (error) {
      console.error("Error fetching zones:", error);
    }
  }

  useEffect(() => {
    fetchZones();
  }, [compartmentID]);


  return (
    <div className="component-container">
      <h1 style={{ margin: "auto" }}>All Zones</h1>
      <p>Only a limited number of Global Zones can be added in OCI free version</p>
      <p>Deleting a Zone take a certain amount of time in OCI . Updates will be reflected Shortly</p>
      <DataTable addRecord={handleOpenModal} showRecords={callRecords} onDelete={handleDelete} add="ZONE"cols={columns} rows={rows}></DataTable>
      <Modal open={open} onClose={handleCloseModal}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
                    <TextField label="Domain Name" value={domain} onChange={(e) => setDomain(e.target.value)} fullWidth />
                    <FormControl fullWidth>
                        <InputLabel>Zone Type</InputLabel>
                        <Select
                            value={zoneType}
                            onChange={(e) => setZoneType(e.target.value)}
                        >
                            <MenuItem value="PRIMARY">Primary</MenuItem>
                        </Select>
                    </FormControl>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleCreate}>Create</Button>
                </div>
            </Modal>
    </div>
  );
}

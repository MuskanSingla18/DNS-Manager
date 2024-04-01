const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const common = require("oci-common");
const os = require('os');
const path = require('path');
const dns = require('oci-dns');
const identity = require('oci-identity')

require('dotenv').config();
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.use(
    cors({
         origin: "https://dns-manager-xi.vercel.app", // allow to server to accept request from different origin
         methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
         credentials: true, // allow session cookie from browser to pass through
   })
  );

//const ociConfigPath = path.join(os.homedir(), '.oci', 'config');

// Use the full path when creating the ConfigFileAuthenticationDetailsProvider
const provider = new common.ConfigFileAuthenticationDetailsProvider({
  userId: process.env.user,
  fingerprint: process.env.fingerprint,
  privateKey: process.env.key_file,
  tenancyId: process.env.tenancy,
});

app.get('/zoneRecords/:ocid/:name/:compartmentID', async (req, res) => {
    
        try {
        const ocid = req.params.ocid;
        const domain = req.params.name;
        const compartmentID = req.params.compartmentID;
        console.log({ocid,domain});
          
        const client = new dns.DnsClient({ authenticationDetailsProvider: provider });
      
          // Create a request and dependent object(s).
          const getZoneRecordsRequest = {
            zoneNameOrId: ocid,
            //ifNoneMatch: "EXAMPLE-ifNoneMatch-Value",
            //ifModifiedSince: "EXAMPLE-ifModifiedSince-Value",
            opcRequestId: "U5EI8W4SWVGTDZEHHDPK",
            limit: 15,
            //page: "EXAMPLE-page-Value",
            //zoneVersion: "EXAMPLE-zoneVersion-Value",
            domain: domain,
            //domainContains: "EXAMPLE-domainContains-Value",
            //rtype: "EXAMPLE-rtype-Value",
            //sortBy: dns.requests.GetZoneRecordsRequest.SortBy.Ttl,
            //sortOrder: dns.models.SortOrder.Desc,
            compartmentId: compartmentID,
            scope: dns.models.Scope.Public,
            //viewId: "ocid1.dnsview.oc1.ap-mumbai-1.amaaaaaafkpn53ia7xshphglkhlxavel6zo7bymgodrllk73fnbgxnphkt6q"
          };
      
          // Send request to the Client.
          const getZoneRecordsResponse = await client.getZoneRecords(getZoneRecordsRequest);
          res.json({data:getZoneRecordsResponse});
        } catch (error) {
          console.log("getZoneRecords Failed with error  " + error);
        }
});

app.post("/createrecord/:ocid/:compartmentID",async (req,res) => {
    try {
        // Create a service client
        const client = new dns.DnsClient({ authenticationDetailsProvider: provider });
        const zoneID = req.params.ocid;
        const compartmentID = req.params.compartmentID;
        const {domain,ttl,rtype,rdata} = req.body;
        // Create a request and dependent object(s).
        const updateZoneRecordsDetails = {
          items: [
            {
              domain: domain,
              //recordHash: "EXAMPLE-recordHash-Value",
              isProtected: true,
              rdata: rdata,
              //rrsetVersion: "EXAMPLE-rrsetVersion-Value",
              rtype: rtype,
              ttl: ttl
            }
          ]
        };
    
        const updateZoneRecordsRequest = {
          zoneNameOrId: zoneID,
          updateZoneRecordsDetails: updateZoneRecordsDetails,
          //ifMatch: "EXAMPLE-ifMatch-Value",
          //ifUnmodifiedSince: "EXAMPLE-ifUnmodifiedSince-Value",
          opcRequestId: "VN2XGK2FDFE6OQOACIGO",
          scope: dns.models.Scope.Global,
          //viewId: "ocid1.test.oc1..<unique_ID>EXAMPLE-viewId-Value",
          compartmentId: compartmentID
        };
    
        const getZoneRecordsResponse = await client.getZoneRecords(updateZoneRecordsRequest);
        res.json({ data: getZoneRecordsResponse });
    } catch (error) {
        console.log("getZoneRecords Failed with error  " + error);
        res.status(500).json({ error: error.message }); // Send error response
    }
})

app.get('/zonelist/:ocid', async (req,res) => {
    (async () => {
        try {
          // Create a service client
          const ocid = req.params.ocid;
          const client = new dns.DnsClient({ authenticationDetailsProvider: provider });
      
          // Create a request and dependent object(s).
          const listZonesRequest = {
            compartmentId: ocid,
            opcRequestId: "FMWI2HQYRHBKDCBEIPAU",
            limit: 28,
            //page: "EXAMPLE-page-Value",
            //name: "EXAMPLE-name-Value",
            //nameContains: "EXAMPLE-nameContains-Value",
            zoneType: dns.requests.ListZonesRequest.ZoneType.Primary,
            //timeCreatedGreaterThanOrEqualTo: new Date("Sun Oct 22 17:56:42 UTC 2045"),
            //timeCreatedLessThan: new Date("Tue Aug 02 02:12:05 UTC 2044"),
            //lifecycleState: dns.requests.ListZonesRequest.LifecycleState.Updating,
            //sortBy: dns.requests.ListZonesRequest.SortBy.TimeCreated,
            //sortOrder: dns.models.SortOrder.Asc,
            scope: dns.models.Scope.Global,
            //viewId: "ocid1.test.oc1..<unique_ID>EXAMPLE-viewId-Value",
            //tsigKeyId: "ocid1.test.oc1..<unique_ID>EXAMPLE-tsigKeyId-Value"
          };
      
          // Send request to the Client.
          const listZonesResponse = await client.listZones(listZonesRequest);
          res.json({data : listZonesResponse});
        } catch (error) {
          console.log("listZones Failed with error  " + error);
        }
      })();
})

app.post('/createzone', async (req,res) => {
    
        try {
          // Create a service client
          const client = new dns.DnsClient({ authenticationDetailsProvider: provider });
          const { domain, zoneType, compartmentID } = req.body;
      
          // Create a request and dependent object(s).
          const createZoneBaseDetails = {
            // migrationSource: "DYNECT",
            // dynectMigrationDetails: {
            //   customerName: "EXAMPLE-customerName-Value",
            //   username: "EXAMPLE-username-Value",
            //   password: "EXAMPLE-password-Value",
            //   httpRedirectReplacements: {
            //     EXAMPLE_KEY_L95IH: [
            //       {
            //         rtype: "EXAMPLE-rtype-Value",
            //         substituteRtype: "EXAMPLE-substituteRtype-Value",
            //         ttl: 42235,
            //         rdata: "EXAMPLE-rdata-Value"
            //       }
            //     ]
            //   }
            // },
            name: domain,
            compartmentId: compartmentID,
            zoneType: zoneType,
            // freeformTags: {
            //   EXAMPLE_KEY_YxBQv: "EXAMPLE_VALUE_iKNkVOeOguF0WYcM9PtT"
            // },
            // definedTags: {
            //   EXAMPLE_KEY_Lmy8s: {
            //     EXAMPLE_KEY_nnlpj: "EXAMPLE--Value"
            //   }
            // }
          };
      
          const createZoneRequest = {
            createZoneDetails: createZoneBaseDetails,
            opcRequestId: "GIQGF0EFMLAPCC113VPF",
            compartmentId: compartmentID,
            scope: dns.models.Scope.Global,
            //viewId: "ocid1.test.oc1..<unique_ID>EXAMPLE-viewId-Value"
          };
      
          // Send request to the Client.
          const createZoneResponse = await client.createZone(createZoneRequest);
          res.json({data: createZoneResponse});
        } catch (error) {
          console.log("createZone Failed with error  " + error);
        }
})

app.get('/compartmentlist',async(req,res) => {
    try {
        // Create a service client
        const client = new identity.IdentityClient({ authenticationDetailsProvider: provider });
    
        // Create a request and dependent object(s).
        const listCompartmentsRequest = {
          compartmentId: "ocid1.tenancy.oc1..aaaaaaaah4qity7w473vsdmhcpk5yiiyo2zi574s6pqp2st3lz5xuf5kg2mq",
          //page: "EXAMPLE-page-Value",
          limit: 208,
          accessLevel: identity.requests.ListCompartmentsRequest.AccessLevel.Any,
          compartmentIdInSubtree: false,
          //name: "EXAMPLE-name-Value",
          //sortBy: identity.requests.ListCompartmentsRequest.SortBy.Name,
          //sortOrder: identity.requests.ListCompartmentsRequest.SortOrder.Asc,
          lifecycleState: identity.models.Compartment.LifecycleState.Active
        };
    
        // Send request to the Client.
        const listCompartmentsResponse = await client.listCompartments(listCompartmentsRequest);
        res.json({data:listCompartmentsResponse});
      } catch (error) {
        console.log("listCompartments Failed with error  " + error);
      }
})

app.post('/createcompartment', async (req,res) => {
    (async () => {
        try {
          // Create a service client
          const client = new identity.IdentityClient({ authenticationDetailsProvider: provider });
          const name = req.body.name;
          const desc = req.body.description;
          // Create a request and dependent object(s).
          const createCompartmentDetails = {
            compartmentId: "ocid1.tenancy.oc1..aaaaaaaah4qity7w473vsdmhcpk5yiiyo2zi574s6pqp2st3lz5xuf5kg2mq",
            name: name,
            description: desc,
            // freeformTags: {
            //   EXAMPLE_KEY_36bLT: "EXAMPLE_VALUE_hkKrqcd1VbPdD1C8uB6l"
            // },
            // definedTags: {
            //   EXAMPLE_KEY_DTHWg: {
            //     EXAMPLE_KEY_dc6WM: "EXAMPLE--Value"
            //   }
            // }
          };
      
          const createCompartmentRequest = {
            createCompartmentDetails: createCompartmentDetails,
            //opcRetryToken: "EXAMPLE-opcRetryToken-Value"
          };
      
          // Send request to the Client.
          const createCompartmentResponse = await client.createCompartment(createCompartmentRequest);
          res.json({data: createCompartmentResponse});
        } catch (error) {
          console.log("createCompartment Failed with error  " + error);
        }
      })();
})

app.delete("/deletecompartment/:ocid", async (req,res) => {
    try {
        // Create a service client
        const client = new identity.IdentityClient({ authenticationDetailsProvider: provider });
        const ocid = req.params.ocid;
    
        // Create a request and dependent object(s).
        const deleteCompartmentRequest = {
          compartmentId: ocid,
          //ifMatch: "EXAMPLE-ifMatch-Value"
        };
    
        // Send request to the Client.
        const deleteCompartmentResponse = await client.deleteCompartment(deleteCompartmentRequest);
        res.json({data: deleteCompartmentResponse});
      } catch (error) {
        console.log("deleteCompartment Failed with error  " + error);
      }
})

app.delete("/deletezone/:ocid/:compartmentID", async (req,res) => {
    try {
        // Create a service client
        const client = new dns.DnsClient({ authenticationDetailsProvider: provider });
        const zoneID = req.params.ocid;
        const compartmentID = req.params.compartmentID;
        // Create a request and dependent object(s).
        const deleteZoneRequest = {
          zoneNameOrId: zoneID,
          //ifMatch: "EXAMPLE-ifMatch-Value",
          //ifUnmodifiedSince: "EXAMPLE-ifUnmodifiedSince-Value",
          opcRequestId: "CFGIEVC6KROZOXMDSZCO",
          scope: dns.models.Scope.Public,
          //viewId: "ocid1.test.oc1..<unique_ID>EXAMPLE-viewId-Value",
          compartmentId: compartmentID
        };
    
        // Send request to the Client.
        const deleteZoneResponse = await client.deleteZone(deleteZoneRequest);
        res.json({data:deleteZoneResponse});
      } catch (error) {
        console.log("deleteZone Failed with error  " + error);
      }
})

app.post("/updatecompartment/:ocid", async(req,res) => {
    try {
        // Create a service client
        const client = new identity.IdentityClient({ authenticationDetailsProvider: provider });
        const desc = req.body.description;
        const name = req.body.name;
        const compartmentID = req.params.ocid;
        // Create a request and dependent object(s).
        const updateCompartmentDetails = {
          description: desc,
          name: name,
        //   freeformTags: {
        //     EXAMPLE_KEY_ApLll: "EXAMPLE_VALUE_lbutnkErcT1QdVtynJbm"
        //   },
        //   definedTags: {
        //     EXAMPLE_KEY_7I6Ri: {
        //       EXAMPLE_KEY_wPG5m: "EXAMPLE--Value"
        //     }
        //   }
        };
    
        const updateCompartmentRequest = {
          compartmentId: compartmentID,
          updateCompartmentDetails: updateCompartmentDetails,
          //ifMatch: "EXAMPLE-ifMatch-Value"
        };
    
        // Send request to the Client.
        const updateCompartmentResponse = await client.updateCompartment(updateCompartmentRequest);
        res.json({data:updateCompartmentResponse});
      } catch (error) {
        console.log("updateCompartment Failed with error  " + error);
      }
})

app.post("/updatezone/:ocid/:comaprtmentID", async (req,res) => {
    try {
        // Create a service client
        const client = new dns.DnsClient({ authenticationDetailsProvider: provider });
    
        // Create a request and dependent object(s).
        const updateZoneDetails = {
          freeformTags: {
            EXAMPLE_KEY_Xqdho: "EXAMPLE_VALUE_2uNAfyDkvujwn6Yjk3xk"
          },
          definedTags: {
            EXAMPLE_KEY_7WcKa: {
              EXAMPLE_KEY_x8Kl0: "EXAMPLE--Value"
            }
          },
          externalMasters: [
            {
              address: "EXAMPLE-address-Value",
              port: 406,
              tsigKeyId: "ocid1.test.oc1..<unique_ID>EXAMPLE-tsigKeyId-Value"
            }
          ],
          externalDownstreams: [
            {
              address: "EXAMPLE-address-Value",
              port: 663,
              tsigKeyId: "ocid1.test.oc1..<unique_ID>EXAMPLE-tsigKeyId-Value"
            }
          ]
        };
    
        const updateZoneRequest = {
          zoneNameOrId: "ocid1.test.oc1..<unique_ID>EXAMPLE-zoneNameOrId-Value",
          updateZoneDetails: updateZoneDetails,
          ifMatch: "EXAMPLE-ifMatch-Value",
          ifUnmodifiedSince: "EXAMPLE-ifUnmodifiedSince-Value",
          opcRequestId: "LGWH2HWOHNGVFI6QVFKP<unique_ID>",
          scope: dns.models.Scope.Global,
          viewId: "ocid1.test.oc1..<unique_ID>EXAMPLE-viewId-Value",
          compartmentId: "ocid1.test.oc1..<unique_ID>EXAMPLE-compartmentId-Value"
        };
    
        // Send request to the Client.
        const updateZoneResponse = await client.updateZone(updateZoneRequest);
      } catch (error) {
        console.log("updateZone Failed with error  " + error);
      }
})

app.listen(9000,function() {
    console.log("app is running on port 9000");
})

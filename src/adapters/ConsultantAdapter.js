/**
 * /*
 *   ConsultantAdapter
 *
 * @format
 * 
 */

import axios from "axios";
const AUTH_HEADER = {
    headers: {
        Authorization: process.env.VUE_APP_JWT_BEARER_TOKEN,
        "Content-Type": "application/json",
    },
};

const NPI_SEARCH_ENDPOINT =
    process.env.VUE_APP_API_URL +
    ":" +
    process.env.VUE_APP_API_PORT +
    process.env.VUE_APP_API_NPIDATA_ENDPOINT +
    "/search";
const NPI_PRACTITIONER_SEARCH_ENDOINT = NPI_SEARCH_ENDPOINT + "/practitioners";
const NPI_ORGANIZATION_SEARCH_ENDOINT = NPI_SEARCH_ENDPOINT + "/organizations";
const NPI_ADDRESSES_SEARCH_ENDOINT = NPI_SEARCH_ENDPOINT + "/addresses";

console.log("NPI_SEARCH_ENDPOINT", NPI_SEARCH_ENDPOINT);
console.log("NPI_PRACTITIONER_SEARCH_ENDOINT", NPI_PRACTITIONER_SEARCH_ENDOINT);
console.log("NPI_ORGANIZATION_SEARCH_ENDOINT", NPI_ORGANIZATION_SEARCH_ENDOINT);
console.log("NPI_ADDRESSES_SEARCH_ENDOINT", NPI_ADDRESSES_SEARCH_ENDOINT);

/* 
const BASE_URL = "http://192.168.0.7:5000/api/v1";
const NPI_SEARCH_ENDOINT = "/npidata/search";
const NPI_PRACTITIONER_SEARCH_ENDOINT = "/npidata/search/practitioners";
const NPI_ORGANIZATION_SEARCH_ENDOINT = "/npidata/search/organizations";
const NPI_ADDRESSES_SEARCH_ENDOINT = "/npidata/search/addresses";
 */

var MyAddress = function(npi, addr) {
    this.active = false;
    this.address1 = addr.street1;
    this.address2 = addr.street2;
    this.city = addr.city;
    this.countrycode = "US";
    this.npi = npi;
    this.phone = "";
    this.postalcode = addr.zip;
    this.purpose = "";
    this.state = addr.state;
};

var Address = function(addr) {
    this.active = false;
    this.address1 = addr.street1;
    this.address2 = addr.street2;
    this.city = addr.city;
    this.countrycode = "US";
    this.npi = addr.npi;
    this.postalcode = addr.zip;
    this.state = addr.state;
    this.md5 = addr.md5;
};

var Phone = function(data) {
    this.npi = data.npi;
    this.md5 = data.md5;
    this.phone = data.phone;
};

var Practitioner = function(data) {
    this.active = false;
    this.gendercode = data.gendercode;
    this.npi = data.npi;
    this.entitytypecode = data.entitytypecode;
    this.firstname = data.firstname;
    this.fullname = data.firstname + " " + data.lastname;
    this.lastname = data.lastname;
    this.suffix = data.suffix;
    this.credential = data.credential;
};

var Organization = function(data) {
    this.active = false;
    this.npi = data.npi;
    this.entitytypecode = data.entitytypecode;
    this.organizationname = data.organizationname;
};

const formatSearchObject = function(obj) {
    var adapted = {};
    if (obj.type === "practitioner") {
        adapted["entitytypecode"] = 1;
    } else if (obj.type === "facility") {
        adapted["entitytypecode"] = 2;
    }
    adapted["otherorgname"] = obj.facilityname;
    adapted["firstname"] = obj.firstname;
    adapted["lastname"] = obj.lastname;
    adapted["city"] = obj.city;
    adapted["state"] = obj.state;
    adapted["postalcode"] = obj.postalcode;
    return adapted;
};

export const ConsultantAdapter = {
    searchOrganizations: async function(payload) {
        const OrganizationSearchObject = function(obj) {
            this.otherorgname =
                obj.facilityname === null ? "" : obj.facilityname;
            this.city = obj.city === null ? "" : obj.city;
            this.state = obj.state === null ? "" : obj.state;
            this.postalcode = obj.postalcode === null ? "" : obj.postalcode;
        };

        let search = new OrganizationSearchObject(payload);
        let res = await axios.post(
            NPI_ORGANIZATION_SEARCH_ENDOINT,
            search,
            AUTH_HEADER
        );
        if (res) {
            console.log(
                "ConsultantAdapter: NPI search returned",
                JSON.stringify(res.data)
            );
            return res.data;
        }
    },

    searchPractitioners: async function(payload) {
        if (payload) {
            const MyPractitioner = function(payload) {
                this.firstname =
                    payload.firstname === null ? "" : payload.firstname;
                this.lastname =
                    payload.lastname === null ? "" : payload.lastname;
                this.city = payload.city === null ? "" : payload.city;
                this.state = payload.state === null ? "" : payload.state;
                this.postalcode =
                    payload.postalcode === null ? "" : payload.postalcode;
            };
            let search = new MyPractitioner(payload);
            console.log("Search object", search);
            let res = await axios.post(
                NPI_PRACTITIONER_SEARCH_ENDOINT,
                search,
                AUTH_HEADER
            );
            if (res) {
                console.log(
                    "ConsultantAdapter: NPI search returned",
                    JSON.stringify(res.data)
                );
                let practitioners = this.adaptPractitioners(res.data);
                return practitioners;
            }
            return search;
        }
    },

    searchContactDetails: async function(payload) {
        let npi = [];
        npi.push(payload);
        let res = await axios.post(
            NPI_ADDRESSES_SEARCH_ENDOINT,
            npi,
            AUTH_HEADER
        );
        if (res) {
            console.log(
                "ConsultantAdapter: NPI search returned",
                JSON.stringify(res.data)
            );
            let addresses = res.data;
            let addrArray = [];
            for (let address of addresses) {
                let addr = new Address(address);
                addr["phones"] = address.phones;
                addrArray.push(addr);
            }
            return addrArray;
        }
        return res.data;
    },

    search: async function(payload) {
        if (payload) {
            let search = formatSearchObject(payload);
            console.log("Search object", search);
            let res = await axios.post(
                NPI_SEARCH_ENDPOINT,
                search,
                AUTH_HEADER
            );
            if (res) {
                console.log(
                    "ConsultantAdapter: NPI search returned",
                    JSON.stringify(res.data)
                );
                let adapted = this.convertProvider(res.data);
                return adapted;
            }
            return search;
        }
    },

    adaptPractitioners: function(practitioners) {
        let prax = [];
        for (let pract of practitioners) {
            prax.push(new Practitioner(pract));
        }
        return prax;
    },

    convertProvider: function(items) {
        var providers = [];
        for (var item of items) {
            var provider = {};
            if (item.entitytypecode === "1") {
                provider = new Practitioner(item);
            } else if (item.entitytypecode === "2") {
                provider = new Organization(item);
            }
            console.log("Converted provider", JSON.stringify(provider));
            provider["addresses"] = [];
            let addrs = item.addresses;
            for (let addr of addrs) {
                var address = new MyAddress(provider.npi, addr);
                address["phones"] = [];
                for (let p of addr.phones) {
                    var phone = new Phone(p);
                    address["phones"].push(phone);
                }
                provider["addresses"].push(address);
            }
            providers.push(provider);
        }
        return providers;
    },
};

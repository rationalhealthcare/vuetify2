/**
 * /*
 *   S3Adapter
 *   Acts as an adapter between the Apppointment Module and the S3 service.
 *   S3 is currently provided by Digitalocean Spaces.
 * 
 * S3 secret        qX2tpzaCIDps+kQc/QwU3A50iqq+cQIFzM1RD/Yk7Gg
 * S3 key           XVMMK3G62F3LSHJM7AW2
 * S3 endpoint      sgp1.digitaloceanspaces.com
 * S3 bucket name   myapi
 
* @format
 */
"use strict";
const AWS = require("aws-sdk");
const S3Endpoint = new AWS.Endpoint("sgp1.digitaloceanspaces.com");
const creds = new AWS.Credentials(
    "XVMMK3G62F3LSHJM7AW2",
    "qX2tpzaCIDps+kQc/QwU3A50iqq+cQIFzM1RD/Yk7Gg",
    null
);
const S3 = new AWS.S3({
    endpoint: S3Endpoint,
    useAccelerateEndpoint: false,
    credentials: creds,
});
const S3_BUCKET = "myapi";

export const S3Adapter = {
    /**
     *
     * GET
     *
     */
    getBinaryFileByKey: async function(key) {
        //wrapped in a promise to execute synchronously
        return new Promise(function(resolve, reject) {
            var params = {
                Bucket: S3_BUCKET,
                Key: key,
            };
            S3.getObject(params, function(err, data) {
                if (err) reject(err);
                resolve(data.Body);
            });
        });
    },
    /**
     *
     * POST
     *
     */

    /**
     *
     * @param {*} files
     * An array of binary files wrapped in a JSON metadata object. The object
     * contans a 'file' property, which contains the binary file.
     */
    uploadArray: async function(files) {
        const me = "S3Adapter";
        const fn = "uploadArray()";
        console.log(me, fn);

        var params = {
            Bucket: "myapi",
            ACL: "private",
        };
        var keys = [];
        for (let myfile of files) {
            params["Key"] = myfile.key;
            params["Body"] = myfile.file;

            console.log(me, fn, "params", params);

            S3.putObject(params, function(err, data) {
                if (err) {
                    console.log(me, fn, err, err.stack);
                    return err;
                } else {
                    console.log(me, fn, data);
                    keys.push(data);
                }
            });
        }
        return keys;
    },

    deleteArray: async function(files) {
        const fn = "S3Adapter.deleteArray() STUB";
        console.log(fn);
        return files;
    },
}; //class

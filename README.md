### Prerequisites
* Java 6 (you can install for OS X with the pkg in the bin folder)
* jt400.jar (in the bin folder)
* Node 6
* VPN connection if the db is being a corporate firewall (such as Cisco)

### Run the test to see how we can integrate w/ AS400
`AS400_HOSTNAME=someipaddressorhost AS400_USER=someuser AS400_PASSWORD=somepassword node tests/int/index.js`

Forks of both node-jt400 and jt400.js are tried here, both with and w/o a monkey-patched version of "sql-query".

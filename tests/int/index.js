const Database = require('../../');
const QueryBuilder = require('../../lib/query-builder')
const database = new Database();


// E.g. 192.6.201.30
const hostname = process.env.AS400_HOSTNAME
// E.g. testuser
const user     = process.env.AS400_USER
// E.g. testpassword12435
const password = process.env.AS400_PASSWORD
const baseURL  = `jdbc:as400://${hostname}`
const libpath  = `${process.cwd()}/bin/jt400.jar`
const dbName   = 'ITJAVATEST/WW52LOGH'
const url      = `${baseURL}/;errors=full;trace=false;naming=SYSTEM;date format=iso;user=${user};password=${password}`
const config   = {
  drivername : 'com.ibm.as400.access.AS400JDBCDriver',
  libpath,
  url
};


console.info('select', QueryBuilder.createSelectQuery(dbName))

const pool = require('node-jt400').pool({ host: hostname, user, password });
pool.query(QueryBuilder.createSelectQuery(dbName))
.then(function (result) {
 console.info('node result', result)
});

database.initialize(config);

/*
const alterSQL1 = `ALTER TABLE ${dbName}
    ADD CONSTRAINT pk_ww52logh
    PRIMARY KEY (HSTREF52)`

const alterSQL2 = `ALTER TABLE ${dbName}
   ADD CONSTRAINT ITJAVATEST/ADRHSTREF FOREIGN KEY (LGNREF52)
   REFERENCES ITJAVATEST/WW50LOGN (LGNREF50)
   ON UPDATE RESTRICT
   ON DELETE CASCADE`
*/

// SELECT statements must be run with execute()
database.execute(`SELECT * FROM ${dbName}`)

database.on('execute', function (error, results) {
  /*
   * Example results:
   * [ { LGNREF52: '1',
    HSTREF52: '1',
    LGNTYP52: 'a',
    LGNDAT52: '2016-06-28',
    LGNTIM52: '13:40:34',
    LGNINF52: 'foobarbazquux',
    USRID52: '' },
  { LGNREF52: '1',
    HSTREF52: '4',
    LGNTYP52: 'a',
    LGNDAT52: '2016-06-28',
    LGNTIM52: '13:46:11',
    LGNINF52: 'foobarbazquux',
    USRID52: '' } ]
  */
  error ? console.error(error) : console.info(results)
});

/*
const createSQL = `
  CREATE TABLE ${dbName}
  (
    LGNREF52  NUMERIC(7),
    HSTREF52  NUMERIC(11)    NOT NULL,
    LGNTYP52  CHAR(3)        NOT NULL,
    LGNDAT52  DATE,
    LGNTIM52  TIME,
    LGNINF52  VARCHAR(256),
    USRID52   CHAR(10)
  )`
*/

console.info('insert', QueryBuilder.createInsertQuery(dbName, {
  LGNREF52 : 1,
  LGNTYP52 : 'a',
  LGNINF52 : 'foobarbazquux'
}))

// INSERT and UPDATE statements must be run with executeUpdate()
// HSTREF52 is always generated
database.executeUpdate(QueryBuilder.createInsertQuery(dbName, {
  LGNREF52 : 1,
  LGNTYP52 : 'a',
  LGNINF52 : 'foobarbazquux'
}));

database.on('executeUpdate', function (error, rowCount) {
  // Example rowCount: `1`
  error ? console.error(error) : console.info(rowCount)
});

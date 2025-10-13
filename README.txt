What Happens When You Run (mongod --dbpath /data/db --replSet rs0)

MongoDB starts up and reads /data/db.

It sees that you want a replica set named rs0, but it’s not yet initialized.

It waits for you to connect (via mongosh) and run:
rs.initiate()
=> {
erfan@surface  ~  mongosh                                         

Current Mongosh Log ID:	68e421d25fc0b1f378ce5f46
Connecting to:		mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.8
Using MongoDB:		8.0.13
Using Mongosh:		2.5.8

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

------
   The server generated these startup warnings when booting
   2025-10-06T23:38:13.681+03:30: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2025-10-06T23:38:15.074+03:30: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2025-10-06T23:38:15.074+03:30: This server is bound to localhost. Remote systems will be unable to connect to this server. Start the server with --bind_ip <address> to specify which IP addresses it should serve responses from, or with --bind_ip_all to bind to all interfaces. If this behavior is desired, start the server with --bind_ip 127.0.0.1 to disable this warning
   2025-10-06T23:38:15.074+03:30: Soft rlimits for open file descriptors too low
   2025-10-06T23:38:15.075+03:30: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
   2025-10-06T23:38:15.075+03:30: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
   2025-10-06T23:38:15.075+03:30: We suggest setting the contents of sysfsFile to 0.
   2025-10-06T23:38:15.075+03:30: Your system has glibc support for rseq built in, which is not yet supported by tcmalloc-google and has critical performance implications. Please set the environment variable GLIBC_TUNABLES=glibc.pthread.rseq=0
   2025-10-06T23:38:15.076+03:30: We suggest setting swappiness to 0 or 1, as swapping can cause performance problems.
------

test> rs.initiate()
... 
{
  info2: 'no configuration specified. Using a default configuration for the set',
  me: 'localhost:27017',
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1759781339, i: 1 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1759781339, i: 1 })
}
rs0 [direct: secondary] test> 
}


After that, MongoDB promotes itself to PRIMARY, meaning:
it can handle writes,
transactions work,
and your Mongoose session.withTransaction(...) code will succeed.
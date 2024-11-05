const cors = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '*');
  
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
  
    if (req.headers.authorization !== 'Basic ' + Buffer.from('coffe:kafe').toString('base64')) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Coffe"');
      return res.status(401).json({ msg: 'Unauthorized' });
    }
  
    next();
  };
  
  module.exports = cors;
  
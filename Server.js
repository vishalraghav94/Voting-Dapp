const express = require('express');
const app = express();
const contractInstance = require('./deployedContracts.js');
const candidates = require('./candidates.js');
const web3 = require('./web3Instance.js');
const bodyParser = require('body-parser');
const path = require('path');
const currentEthAccount = web3.eth.accounts[0];

app.use(express.static(path.join(__dirname + '/public')));
app.use(bodyParser.json());

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/vote', function(req, res) {
  try {
      console.log(req.body);
      const candidateName = req.body.candidateName;
      voteFor(candidateName, res);
  }
  catch(e) {
      res.send(`error occured ${e}`);
  }
});

app.get('/candidates', function(req,res) {
    try {
        const response = candidates.map(function(candidate) {
            console.log(candidate);
            return {candidate: candidate, votes: totalVotesFor(candidate)};
        });
        res.send({candidates: response});
    }
    catch(e) {
        res.send(`Error occured ${e}`);
    }
});

app.listen(3000, function () {
    console.log('App ready and listening on port 3000!')
});

function voteFor(candidate, response) {
    console.log(candidate);
    contractInstance.voteFor(candidate, {from: currentEthAccount}, function() {
        const totalVotesForCandidate = totalVotesFor(candidate);
        response.send({candidate: candidate, votes: totalVotesForCandidate});
    });
}
function totalVotesFor(candidate) {
    const votes = contractInstance.totalVotesFor.call(candidate, {from: currentEthAccount}).toString();
    return votes;
}

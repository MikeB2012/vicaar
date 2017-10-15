# Usage

`node cli.js`

`train --output outnetwork.json --network network.json --data data.ndjson`

`run --network network.json --data file.json`

## Example

```bash
# Create a new network with one hidden layer with 2 nodes, using tanh for activation
node cli.js train --output ./data/outnetwork.json --data ./data/fake_training.ndjson --layer 2 --activation tanh

# Test network
node cli.js run --network ./data/outnetwork.json --data ./data/fake_training_test.json
```

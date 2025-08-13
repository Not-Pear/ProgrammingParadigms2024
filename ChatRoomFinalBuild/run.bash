#!/bin/bash
set -e
echo "transpileing"
tsc --strict server.ts
tsc --strict chat.ts
echo "launching server..."
ts-node server &
echo "launching client..."
open http://127.0.0.1:8080/client.html &
echo "waiting for all processes to finish..."
wait
echo "Done."




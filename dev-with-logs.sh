#!/bin/bash

# Development logging script for peek-a-boo project
echo "=== Development Session Started at $(date) ===" >> dev-logs.log
echo "" >> dev-logs.log

# Run pnpm dev and capture all output (stdout + stderr) to both terminal and log file
pnpm dev 2>&1 | tee -a dev-logs.log

echo "" >> dev-logs.log
echo "=== Development Session Ended at $(date) ===" >> dev-logs.log
echo "================================================" >> dev-logs.log
echo "" >> dev-logs.log
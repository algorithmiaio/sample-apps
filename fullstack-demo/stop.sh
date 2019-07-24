#!/usr/bin/env bash
mongo --eval "db.getSiblingDB('admin').shutdownServer()"
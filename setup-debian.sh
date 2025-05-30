#bin/sh

echo "updating system"
sudo apt update && sudo apt upgrade -y

echo "installing stuff"
sudo apt install nano curl git wget

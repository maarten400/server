#bin/sh

echo "updating system"
sudo apt update && sudo apt upgrade -y

echo "installing stuff"
sudo apt install nano curl git wget -y

echo "ssh generating keys"
ssh-keygen -t ed25519 

cat ~/.ssh/id_ed25519.pub | cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys

sudo sed -i '/^#\?PasswordAuthentication/c\PasswordAuthentication no' /etc/ssh/sshd_config
sudo sed -i '/^#\?PubkeyAuthentication/c\PubkeyAuthentication yes' /etc/ssh/sshd_config

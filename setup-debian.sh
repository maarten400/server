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


echo "copy public key from .ssh folder and run sudo systemctl restart ssh"

### unattended upgrades ####

set -e

echo "[*] Installing unattended-upgrades and apt-utils..."
sudo apt update
sudo apt install -y unattended-upgrades apt-utils

echo "[*] Enabling unattended-upgrades..."
sudo dpkg-reconfigure --priority=low unattended-upgrades

echo "[*] Creating /etc/apt/apt.conf.d/20auto-upgrades..."
cat <<EOF | sudo tee /etc/apt/apt.conf.d/20auto-upgrades
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
EOF

echo "[*] Configuring /etc/apt/apt.conf.d/50unattended-upgrades..."
sudo sed -i 's|//\(.*"${distro_id}:${distro_codename}-security";\)|\1|' /etc/apt/apt.conf.d/50unattended-upgrades

# Optional: enable auto removal of unused dependencies
sudo sed -i 's|//Unattended-Upgrade::Remove-Unused-Dependencies.*|Unattended-Upgrade::Remove-Unused-Dependencies "true";|' /etc/apt/apt.conf.d/50unattended-upgrades

# Optional: enable automatic reboot if needed
sudo sed -i 's|//Unattended-Upgrade::Automatic-Reboot.*|Unattended-Upgrade::Automatic-Reboot "true";|' /etc/apt/apt.conf.d/50unattended-upgrades

echo "[*] Testing unattended-upgrades configuration..."
sudo unattended-upgrade --dry-run --debug

echo "[✓] Unattended upgrades are configured!"

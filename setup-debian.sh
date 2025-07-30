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

echo "[*] Configuring /etc/apt/apt.conf.d/50unattended-upgrades for all updates..."

DISTRO_ID=$(lsb_release -si)
DISTRO_CODENAME=$(lsb_release -sc)

cat <<EOF | sudo tee /etc/apt/apt.conf.d/50unattended-upgrades
Unattended-Upgrade::Allowed-Origins {
        "${DISTRO_ID}:${DISTRO_CODENAME}";
        "${DISTRO_ID}:${DISTRO_CODENAME}-security";
        "${DISTRO_ID}:${DISTRO_CODENAME}-updates";
};

Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "03:00";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Remove-New-Unused-Dependencies "true";
Unattended-Upgrade::MailOnlyOnError "true";
EOF

echo "[*] Testing configuration with dry-run..."
sudo unattended-upgrade --dry-run --debug

echo "[✓] Unattended upgrades are now set to install ALL updates."

echo "copy public key from .ssh folder and run sudo systemctl restart ssh"

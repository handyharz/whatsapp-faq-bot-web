# Oracle Cloud Free Tier A1 Instance Setup Guide
## Complete Step-by-Step Guide for WhatsApp Bot Deployment


## Account Setup

### 1. Sign Up for Oracle Cloud
1. Go to https://www.oracle.com/cloud/free/
2. Click "Start for free"
3. Fill in your details
4. **CRITICAL: Choose your home region carefully**
   - Recommended for Nigeria: **South Africa (Johannesburg)**
   - Alternative: **Spain (Madrid)**
   - **AVOID:** Seoul, Tokyo (overcrowded, hard to get A1 instances)
5. Complete email verification
6. Add payment method (required for verification, won't be charged)

### 2. Understanding Free Tier Limits

**Always Free Resources (ARM-based A1 Compute):**
- Up to **4 ARM OCPUs** (cores) total
- Up to **24 GB RAM** total
- **200 GB** block storage total
- Can split across multiple instances

**Example configurations:**
- 1 instance: 4 cores + 24 GB RAM
- 2 instances: 2 cores + 12 GB each
- 4 instances: 1 core + 6 GB each

---

## Networking Setup

### Why You Need This
The default instance creation doesn't always create a proper public subnet, which means you won't be able to assign a public IP address. This section ensures you can actually access your instance.

### Step 1: Create Virtual Cloud Network (VCN)

1. Log into Oracle Cloud Console
2. Click the **☰ hamburger menu** (top left)
3. Navigate to **Networking** → **Virtual Cloud Networks**
4. Click **"Start VCN Wizard"** or **"Create VCN"**

### Step 2: VCN Wizard Configuration

1. Select **"VCN with Internet Connectivity"**
2. Click **"Start VCN Wizard"**
3. Fill in the details:

   ```
   VCN Name: whatsapp-bot-vcn
   Compartment: (root) or your compartment
   VCN CIDR Block: 10.0.0.0/16 (default is fine)
   Public Subnet CIDR: 10.0.0.0/24 (default is fine)
   Private Subnet CIDR: 10.0.1.0/24 (optional, can skip)
   ```

4. Click **"Next"**
5. Review and click **"Create"**
6. Wait 30-60 seconds for creation to complete

### Step 3: Create Public Subnet (If Not Auto-Created)

If the wizard didn't create a subnet:

1. Go to your VCN details page
2. Click **"Subnets"** in left sidebar
3. Click **"Create Subnet"**
4. Configure:

   ```
   Name: public-subnet
   Compartment: (root)
   Subnet Type: Regional (recommended)
   IPv4 CIDR Block: 10.0.1.0/24
   Subnet Access: ⚠️ PUBLIC SUBNET (CRITICAL!)
   Route Table: Default Route Table for [your-vcn-name]
   DHCP Options: Default
   Security List: Default Security List for [your-vcn-name]
   ```

5. **DNS Settings:**
   - ✅ Check "Use DNS hostnames in this Subnet"
   - DNS Label: `publicsubnet`

6. Click **"Create Subnet"**
7. Wait for status to change to **"Available"** (~30 seconds)

---

## Instance Creation

### Step 1: Navigate to Compute Instances

1. Click **☰ hamburger menu**
2. Go to **Compute** → **Instances**
3. Click **"Create Instance"**

### Step 2: Basic Configuration

```
Name: whatsapp-bot-1 (or your preferred name)
Compartment: (root)
Placement:
  - Availability Domain: AD-1 (or any available)
  - Capacity Type: On-demand capacity
  - Fault Domain: Let Oracle choose
```

### Step 3: Image Selection

1. Click **"Change Image"** (if needed)
2. Select:
   ```
   Operating System: Oracle Linux
   OS Version: Oracle Linux 9
   Image Build: Latest (e.g., 2025.11.20-0)
   ```
3. Click **"Select Image"**

### Step 4: Shape Configuration ⚠️ CRITICAL

1. Click **"Change Shape"**
2. **Shape Series:** Ampere
3. **Shape Name:** Select **VM.Standard.A1.Flex**
4. Look for **"Always Free-eligible"** label
5. Configure resources:

   **Recommended for WhatsApp Bot:**
   ```
   Number of OCPUs: 2
   Amount of Memory (GB): 12
   ```

   **Minimum viable:**
   ```
   Number of OCPUs: 1
   Amount of Memory (GB): 8
   ```

6. Click **"Select Shape"**

### Step 5: Networking Configuration

1. **Primary VNIC Information:**
   ```
   VNIC Name: whatsapp-bot-1
   ```

2. **Network Selection:**
   - ⚪ Create new virtual cloud network
   - 🔘 **Select existing virtual cloud network** ✅
   
3. **Select Your VCN:**
   ```
   Virtual Cloud Network: whatsapp-bot-vcn (or your VCN name)
   ```

4. **Subnet Selection:**
   - ⚪ Create new subnet
   - 🔘 **Select existing subnet** ✅
   
5. **Select Your Public Subnet:**
   ```
   Subnet: public-subnet (must show "Public" type)
   ```

6. **IP Address Configuration:**
   ```
   Private IPv4 Address: 
     🔘 Automatically assign private IPv4 address
   
   Public IPv4 Address:
     ✅ Automatically assign public IPv4 address
        ⚠️ If this is NOT clickable, your subnet is wrong!
        Go back and ensure you selected a PUBLIC subnet.
   
   IPv6 Address:
     ☐ Leave unchecked (not needed)
   ```

### Step 6: SSH Key Configuration ⚠️ CRITICAL

**Option 1: Generate New Keys (Recommended for Beginners)**

1. Select: 🔘 **"Generate a key pair for me"**
2. Click **"Save Private Key"** → Download and save securely
3. Click **"Save Public Key"** → Download (optional but recommended)
4. **⚠️ IMPORTANT:** Store the private key safely - you cannot download it again!

**Option 2: Upload Existing Key**

1. Select: 🔘 **"Upload public key file (.pub)"**
2. Browse and select your `.pub` file
3. Or paste your public key content

**Option 3: No SSH Keys (NOT RECOMMENDED)**

- You won't be able to access your instance
- Only use if you know what you're doing

### Step 7: Boot Volume Configuration

```
Boot Volume Size: 50 GB (default is fine for bot)
  - Free tier includes up to 200 GB total
  - 50 GB is plenty for WhatsApp bot

Use in-transit encryption: ✅ Enabled (default)
```

### Step 8: Advanced Options (Optional)

**Security (Generally not needed for WhatsApp bot):**
```
☐ Shielded instance - Leave unchecked
☐ Confidential computing - Leave unchecked
```

**Oracle Cloud Agent:**
- Leave defaults (most enabled, some disabled)
- These don't affect your bot's functionality

### Step 9: Review and Create

1. **Review the summary:**
   ```
   ✅ Shape: VM.Standard.A1.Flex (Always Free-eligible)
   ✅ OCPUs: 1-4 (within free tier)
   ✅ Memory: 6-24 GB (within free tier)
   ✅ Image: Oracle Linux 9
   ✅ Subnet: PUBLIC subnet
   ✅ Public IPv4: Yes
   ✅ SSH Keys: Configured
   ```

2. **Cost Estimate:**
   - May show €1.85/month during configuration (UI bug)
   - Should be **€0.00/month** if properly configured
   - Verify in billing after creation

3. Click **"Create"**

### Step 10: Wait for Provisioning

1. Status will show **"Provisioning"** (orange)
2. Wait 2-5 minutes
3. Status changes to **"Running"** (green) ✅
4. Note your **Public IP Address** - you'll need this to connect

---
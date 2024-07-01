import subprocess
import os

# Use the 7z command line tool to extract the archive
archive_path = r'.\ats.7z'
extracted_path = r'.\extracted_ats'

# Create the output directory if it doesn't exist
os.makedirs(extracted_path, exist_ok=True)

try:
    # Run the 7z command to extract the archive
    subprocess.run(['7z', 'x', archive_path, f'-o{extracted_path}'], check=True)
    
    # List the extracted files to see what we have
    extracted_files = []
    for root, dirs, files in os.walk(extracted_path):
        for file in files:
            extracted_files.append(os.path.join(root, file))

    print(extracted_files)

except FileNotFoundError:
    print("7z executable not found. Ensure 7-Zip is installed and added to PATH.")
except subprocess.CalledProcessError as e:
    print(f"An error occurred while extracting the archive: {e}")

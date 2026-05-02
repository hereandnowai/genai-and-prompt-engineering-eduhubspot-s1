import os

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, "10-hello.txt")

with open(file_path) as f:
    text = f.read()

print(text)


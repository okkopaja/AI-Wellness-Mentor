with open("G:/ollama/MODELS/blobs/sha256-dde5aa3fc5ffc17176b5e8bdc82f587b24b2678c6c66101bf7da77af9f7ccdff", "rb") as f:
    header = f.read(2000)
    print(header.decode(errors="ignore"))

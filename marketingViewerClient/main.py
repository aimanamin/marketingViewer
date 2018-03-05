import socket
import sys

server_address = ('localhost', 5005)
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
message = sys.argv[1].split(".")[-2].split('-')[-1]

try:
    sent = sock.sendto(message, server_address)
except:
    print("ERROR")

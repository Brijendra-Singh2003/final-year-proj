import base64
import os

from cryptography.hazmat.primitives.ciphers.aead import AESGCM


def _get_key() -> bytes:
    raw = os.getenv("ENCRYPTION_KEY", "")
    if not raw:
        raise RuntimeError("ENCRYPTION_KEY is not set")
    return base64.urlsafe_b64decode(raw)


def encrypt_file(src_path: str, dest_path: str) -> None:
    """Encrypt src_path with AES-256-GCM, write nonce+ciphertext to dest_path."""
    key = _get_key()
    nonce = os.urandom(12)
    aesgcm = AESGCM(key)
    with open(src_path, "rb") as f:
        plaintext = f.read()
    ciphertext = aesgcm.encrypt(nonce, plaintext, None)
    with open(dest_path, "wb") as f:
        f.write(nonce + ciphertext)


def decrypt_file(src_path: str, dest_path: str) -> None:
    """Decrypt AES-256-GCM file at src_path, write plaintext to dest_path."""
    key = _get_key()
    aesgcm = AESGCM(key)
    with open(src_path, "rb") as f:
        data = f.read()
    nonce, ciphertext = data[:12], data[12:]
    plaintext = aesgcm.decrypt(nonce, ciphertext, None)
    with open(dest_path, "wb") as f:
        f.write(plaintext)

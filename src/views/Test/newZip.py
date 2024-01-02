import itertools
import pyzipper

def generate_passwords(length):
    characters = "123456789"
    passwords = itertools.product(characters, repeat=length)
    return (''.join(password) for password in passwords)

def try_passwords(zip_file, passwords):
    with pyzipper.AESZipFile(zip_file, 'r', compression=pyzipper.ZIP_LZMA, encryption=pyzipper.WZ_AES) as f:
        password_count = 0
        for password in passwords:
            password_str = ''.join(password)
            f.setpassword(password_str.encode('utf-8'))
            try:
                f.extractall()  # 使用密码尝试解压
                print("[+] Found password:", password_str)
                return
            except Exception:
                # 解压失败说明密码错误，继续尝试下一个密码
                password_count += 1
                print(f"[-] Attempt #{password_count}: {password_str}")

def main():
    zip_file_name = "test1.zip"

    for length in range(1, 10):  # 设置密码长度范围
        passwords = generate_passwords(length)
        try_passwords(zip_file_name, passwords)

if __name__ == '__main__':
    main()

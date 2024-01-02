import zipfile
import itertools
 
filename = "test1.zip"
 
 
def uncompress(file_name, pass_word):
    try:
        with zipfile.ZipFile(file_name) as z_file:
            z_file.extractall("./", pwd=pass_word.encode("utf-8"))
        return True
    except:
        return False
 
chars = "0123456789"
for i in range(12):
    for c in itertools.permutations(chars, i):
        password = ''.join(c)
        print(password)
        result = uncompress(filename, password)
        if not result:
            print('解压失败。', password)
        else:
            print('解压成功。', password)
            break

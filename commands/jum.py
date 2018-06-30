import os
import re
import shutil
import tempfile
import fileinput

def create_temporary_copy(path):
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, "melee_script")
    shutil.copytree(path, temp_path)
    return temp_path

def add_move_import(line):
	if 'import JUMPF from "../../shared/moves/JUMPF";' not in line:
		print('import JUMPF from "../../shared/moves/JUMPF";' + '\n' + line, end='')
	else:
		print(line, end='')

def replace_move(line):
  line = re.sub(r'([\w]+\.)?[\w]+\.init(.*?);', 'JUMPF.init(p, true, input);', line)
  # print(line)
  print(line, end='')

def modify_files(filelist):
	if not filelist:
		# TODO: Fix this mess..
		print("Err: filelist can not be empty..")
		raise SystemExit(0)
	print(filelist)
	with fileinput.input(files=filelist, inplace=True, backup='.bak') as file:
		print('filename:', file.filename())
		for line in file:
			if file.isfirstline():
				add_move_import(line)
			else:
				replace_move(line)

def real_dir():
	os.chdir(os.path.dirname(os.path.realpath(__file__)))
	os.chdir('..')

def add_directories(chars):
	dirlist = []
	for char in chars:
		dirlist.append(os.path.abspath('./src/characters/' + char + '/moves'))
	return dirlist

def add_files(dirlist, filter = '.js'):
	filelist = []
	for directory in dirlist:
		# os.chdir(directory)
		for path in os.listdir(directory):
			print(path)
			if path.endswith(filter):
				os.chdir(directory)
				filelist.append(os.path.abspath(path))
	return filelist


real_dir()
chars = ['falco', 'falcon', 'fox', 'marth', 'puff']
dirlist = add_directories(chars)
filelist = add_files(dirlist)
# filelist = add_files(['./commands'], '.txt')
# print(filelist)
print(filelist)
modify_files(filelist)








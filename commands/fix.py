import os

def real_dir():
	os.chdir(os.path.dirname(os.path.realpath(__file__)))
	os.chdir('..')


real_dir()
for root, dirs, files in os.walk('./src'):
	for file in files:
		if file.endswith('.bak'):
			print('renaming', os.path.join(root, file), 'to', os.path.join(root, file.replace('.bak', '')))
			os.replace(os.path.join(root, file), os.path.join(root, file.replace('.bak', '')))

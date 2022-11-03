import os
import shutil

def main():
    leave_files = [
      ".git",
      "LICENSE",
      "README.md"
    ]

    src_dir = "Z:/projects/fat-png/build"
    dst_dir = "Z:/projects/fat-png-web"
    for name in os.listdir(dst_dir):
        if name in leave_files:
            continue

        path = os.path.join(dst_dir, name)
        if os.path.isdir(path):
            shutil.rmtree(path)
        else:
            os.remove(path)

    for name in os.listdir(src_dir):
        src_path = os.path.join(src_dir, name)
        dst_path = os.path.join(dst_dir, name)
        if os.path.isdir(src_path):
            shutil.copytree(src_path, dst_path)
        else:
            shutil.copy2(src_path, dst_path)

if __name__ == '__main__':
    exit(main())

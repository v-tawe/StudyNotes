# Docker

解决了运行环境和配置的容器

## Docker 与 VM 对比

|            | Docker                   | VM                          |
| ---------- | ------------------------ | --------------------------- |
| 操作系统   | 与宿主机共享 OS          | 宿主机 OS 上运行虚拟机 OS   |
| 存储大小   | 镜像小，便于存储与传输   | 镜像庞大                    |
| 运行性能   | 几乎无额外性能损失       | 操作系统额外的 CPU,内存消耗 |
| 移植性     | 轻便、灵活、适应于 Linux | 笨重，与虚拟化技术高耦合    |
| 硬件亲和度 | 面向软件开发者           | 面向硬件运维者              |
| 部署速度   | 快速，秒级               | 慢速，分钟级                |

## Image 镜像

## Container 容器

## Repository 仓库

- `docker iamges` 显示 images
- `docker pull <image>` 现在仓库中的 image
- `docker run` 
- `docker commit -a "author" -m "description" srcImageID targetImageName`
- ``

------------
待续。。。
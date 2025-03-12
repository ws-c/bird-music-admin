import React, { useState, useRef } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Replace } from "lucide-react";
import { toast } from "react-hot-toast";
import "react-image-crop/dist/ReactCrop.css";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { put } from "@/utils/oss";

export interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  catalogue: string;
}

export const ImageUploader = ({
  value,
  onChange,
  className,
  catalogue,
}: ImageUploaderProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tempSrc, setTempSrc] = useState(""); // 用于对话框中的临时图片
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    width: 240,
    height: 240,
    x: 0,
    y: 0,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null); // 保存选中的文件
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    e.target.value = ""; // 重置输入框

    const reader = new FileReader();
    reader.onload = () => {
      setTempSrc(reader.result as string);
      setDialogOpen(true);
    };
    reader.readAsDataURL(selectedFile);

    // 保存选中的文件
    setFile(selectedFile);
  };

  // 转换图片为 WebP 格式
  const convertToWebP = async (image: HTMLImageElement, crop: Crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // 转换为WebP格式
    const webpDataUrl = canvas.toDataURL("image/webp", 0.8); // 调整质量参数

    // 转换为File对象
    const response = await fetch(webpDataUrl);
    const blob = await response.blob();
    const webpFile = new File([blob], "image.webp", { type: "image/webp" });

    return webpFile;
  };

  const handleUploadConfirm = async () => {
    if (!file || !imageRef.current) {
      return toast.error("未选择文件");
    }

    try {
      setIsUploading(true);

      // 裁剪后生成 WebP 文件
      const webpFile = await convertToWebP(imageRef.current, crop);
      if (!webpFile) return;
      if (webpFile.size <= 0) return toast.error("请选中图片");
      // 如果文件大于 150KB，提示用户
      if (webpFile.size > 150 * 1024) {
        return toast.error("裁剪后的图片超过150KB，请调整裁剪区域或图片质量");
      }
      const url = await put(
        `${catalogue}/${Date.now()}_${webpFile.name}`,
        webpFile
      );

      onChange(url);
      setDialogOpen(false);
      toast.success("上传成功");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "上传失败");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 图片展示 */}
      <div className="group relative h-60 w-60 rounded-lg border-2 border-dashed border-gray-200 p-2">
        {value && (
          <div className="relative">
            <Image
              src={value}
              width={240}
              height={240}
              alt="已上传图片"
              className="mx-auto object-contain transition-all duration-100 group-hover:brightness-90"
            />
          </div>
        )}
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            value
              ? "opacity-0 transition-opacity duration-100 group-hover:opacity-100"
              : "opacity-100"
          }`}
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full bg-white/90 p-3 shadow-lg transition-all hover:scale-105 hover:bg-white/100"
          >
            {value ? (
              <Replace className="h-5 w-5 text-gray-700" />
            ) : (
              <Plus className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* 裁剪对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑并上传图片</DialogTitle>
          </DialogHeader>

          <div>
            {tempSrc && (
              <ReactCrop
                crop={crop}
                onChange={setCrop}
                minWidth={200}
                minHeight={200}
                maxWidth={600}
                maxHeight={600}
                aspect={1 / 1}
              >
                <Image
                  ref={imageRef}
                  src={tempSrc}
                  width={600}
                  height={600}
                  alt="图片裁剪预览"
                />
              </ReactCrop>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isUploading}
            >
              取消
            </Button>
            <Button
              onClick={() => void handleUploadConfirm()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  上传中...
                </>
              ) : (
                "确认上传"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

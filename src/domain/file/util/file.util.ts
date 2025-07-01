export class FileUtil {
  /**
   * URL로부터 S3Key 추출
   * @param url URL
   * @returns S3Key
   */
  public getS3KeyFromUrl(url: string) {
    const bucketName = process.env.S3_BUCKET_NAME;
    const prefix = `https://${bucketName}.s3.ap-northeast-2.amazonaws.com/`;
    if (url.startsWith(prefix)) {
      return url.substring(prefix.length);
    }
    return null;
  }

  /**
   * S3 키로 파일 링크 생성
   * @param s3Key S3 키
   * @returns 파일 링크
   */
  public getFileLinkFromS3Key({ s3Key }: { s3Key: string }) {
    return `https://${process.env.S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/${s3Key}`;
  }
}

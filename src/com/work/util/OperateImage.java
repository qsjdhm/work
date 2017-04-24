package com.work.util;

import com.work.vo.TArticle;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 操作图片工具类
 */
public class OperateImage {
	
	// 过滤img标签
	public String filterImage(String content){
		HtmlRegexp regexpHtml = new HtmlRegexp();
		String html = regexpHtml.fiterHtmlTag(regexpHtml.fiterHtmlTag(content, "img"), "IMG");
		
		return html;
	}

	// 生成html代码
	public String getFirstImage(String content){
		
		return "";
	}
	
	
	
	// 获得某个目录下所有文件
	public JSONObject getAllFiles(String filePath, int startDate,
			int endDate, int page, int size) throws FileNotFoundException,
			IOException {
		JSONArray backupJsonArray = new JSONArray();

		try {
			File file = new File(filePath);
			if (file.isDirectory()) {
				String[] filelist = file.list();
				for (int i = 0; i < filelist.length; i++) {
					File readFile = new File(filePath + System.getProperty("file.separator") + filelist[i]);
					if (!readFile.isDirectory()) {
						String fileName = readFile.getName().substring(readFile.getName().lastIndexOf(System.getProperty("file.separator")) + 1);
						int fileSize = getSize(filePath + System.getProperty("file.separator") + fileName);
						long time = file.lastModified();//返回文件最后修改时间，是以个long型毫秒数
						String createTime = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format(new Date(time));
						JSONObject backupJson = new JSONObject();
						backupJson.put("Picture_Name", fileName);
						backupJson.put("Picture_Size", (fileSize/1000)+"KB");
						backupJson.put("Picture_Time", createTime);
						backupJsonArray.add(backupJson);
					}
				}
			}
		} catch (FileNotFoundException e) {
			System.out.println("readfile()   Exception:" + e.getMessage());
		}

		// 倒序
		Collections.reverse(backupJsonArray);
		// 返回查询条件后的数据
		return getFilesByFiltration(backupJsonArray, startDate, endDate, page,
				size);
	}

	// 获得某个目录下所有文件
	public JSONObject getFilesByFiltration(JSONArray backupJsonArray,
			int startDate, int endDate, int page, int size)
			throws FileNotFoundException, IOException {

		int coinDateCount = 0; // 记录符合时间区间的文件总数，不受分页限制

		// 先得到符合时间的数据
		JSONArray coinDateArray = new JSONArray();
		for (int i = 0; i < backupJsonArray.size(); i++) {
			JSONObject obj = backupJsonArray.getJSONObject(i);
			//int name = Integer.parseInt(obj.getString("Picture_Name").split("\\.")[0]);
			// 先过滤时间区间，在过滤页数
//			if (name >= startDate && name <= endDate) {
//				coinDateArray.add(obj);
//				coinDateCount++;
//			}
			
			coinDateArray.add(obj);
			coinDateCount++;
		}

		// 再得到分页的数据
		JSONArray filterArray = new JSONArray();
		int startNumber = (page - 1) * size; // 起始数据下标
		int endNumber = page * size; // 结束数据下标
		for (int i = 0; i < coinDateArray.size(); i++) {
			JSONObject obj = coinDateArray.getJSONObject(i);
			if (i >= startNumber && i < endNumber) {
				filterArray.add(obj);
			}
		}

		JSONObject jsonObject = new JSONObject();
		jsonObject.put("data", filterArray);
		jsonObject.put("count", coinDateCount);
		return jsonObject;
	}

	// 获得文件的大小
	public int getSize(String filePath) throws FileNotFoundException,
			IOException {
		File file = new File(filePath);
		if (file.exists() && file.isFile()) {
			return (int) file.length();
		} else {
			System.out.println("文件不存在或不是一个文件");
		}
		return 0;
	}
	
	// 删除文件
	public Boolean delFiles(String filePath, String selectIds) throws FileNotFoundException, IOException {
		String [] selectFiles = selectIds.split(";");
		File file = new File(filePath);
		if (file.isDirectory()) {
			String[] filelist = file.list();
			for (int i = 0; i < filelist.length; i++) {
				File readFile = new File(filePath + System.getProperty("file.separator") + filelist[i]);
				if (!readFile.isDirectory()) {
					String fileName = readFile.getName().substring(readFile.getName().lastIndexOf(System.getProperty("file.separator")) + 1);
					for (int j = 0; j < selectFiles.length; j++) {
						if (selectFiles[j].equals(fileName)) {
							readFile.delete();
							continue;
						}
					}
				}
			}
		}
		
		return true;
	}
	
}

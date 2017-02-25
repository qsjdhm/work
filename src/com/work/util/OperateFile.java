package com.work.util;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Collections;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 操作字符串工具类
 */
public class OperateFile {

	// 获得某个目录下的文件总个数
	public int getFileCount(String filePath)
			throws FileNotFoundException, IOException {
		int count = 0;
		try {
			File file = new File(filePath);
			if (file.isDirectory()) {
				String[] filelist = file.list();
				for (int i = 0; i < filelist.length; i++) {
					File readfile = new File(filePath + System.getProperty("file.separator") + filelist[i]);
					if (!readfile.isDirectory()) {
						count++;
					} else if (readfile.isDirectory()) {
						getFileCount(filePath + System.getProperty("file.separator") + filelist[i]);
					}
				}
			}
		} catch (FileNotFoundException e) {
			System.out.println("readfile()   Exception:" + e.getMessage());
		}

		return count;
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
						JSONObject backupJson = new JSONObject();
						backupJson.put("Backup_Name", fileName);
						backupJson.put("Backup_Size", fileSize);
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
			int name = Integer.parseInt(obj.getString("Backup_Name").split("\\.")[0]);
			// 先过滤时间区间，在过滤页数
			if (name >= startDate && name <= endDate) {
				coinDateArray.add(obj);
				coinDateCount++;
			}
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

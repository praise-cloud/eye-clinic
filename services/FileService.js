const { dialog, shell } = require('electron');
const fs = require('fs-extra');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

class FileService {
    constructor() {
        this.tempDir = null;
    }

    async initializeTempDirectory() {
        if (!this.tempDir) {
            const { app } = require('electron');
            this.tempDir = path.join(app.getPath('userData'), 'temp');
            await fs.ensureDir(this.tempDir);
        }
        return this.tempDir;
    }

    // File Selection Operations
    async selectFile(options = {}) {
        try {
            const result = await dialog.showOpenDialog({
                title: options.title || 'Select File',
                defaultPath: options.defaultPath,
                buttonLabel: options.buttonLabel || 'Select',
                filters: options.filters || [
                    { name: 'All Files', extensions: ['*'] },
                    { name: 'Text Files', extensions: ['txt', 'csv'] },
                    { name: 'Excel Files', extensions: ['xlsx', 'xls'] },
                    { name: 'PDF Files', extensions: ['pdf'] }
                ],
                properties: options.multiple ? ['openFile', 'multiSelections'] : ['openFile']
            });

            if (result.canceled) {
                return { success: false, canceled: true };
            }

            const filePaths = result.filePaths;
            const files = [];

            for (const filePath of filePaths) {
                const stats = await fs.stat(filePath);
                const fileName = path.basename(filePath);
                const fileExtension = path.extname(filePath);
                
                files.push({
                    path: filePath,
                    name: fileName,
                    extension: fileExtension,
                    size: stats.size,
                    lastModified: stats.mtime
                });
            }

            return {
                success: true,
                files: options.multiple ? files : files[0]
            };
        } catch (error) {
            console.error('File selection error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // File Save Operations
    async saveFile(options = {}) {
        try {
            const result = await dialog.showSaveDialog({
                title: options.title || 'Save File',
                defaultPath: options.defaultPath,
                buttonLabel: options.buttonLabel || 'Save',
                filters: options.filters || [
                    { name: 'PDF Files', extensions: ['pdf'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

            if (result.canceled) {
                return { success: false, canceled: true };
            }

            if (options.data) {
                await fs.writeFile(result.filePath, options.data);
            }

            return {
                success: true,
                filePath: result.filePath
            };
        } catch (error) {
            console.error('File save error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Read File Content
    async readFile(filePath, encoding = 'utf8') {
        try {
            const content = await fs.readFile(filePath, encoding);
            return {
                success: true,
                content: content
            };
        } catch (error) {
            console.error('File read error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // CSV File Processing for Test Data
    async parseCSVTestData(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            const lines = content.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            
            const testData = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    const values = line.split(',');
                    const testEntry = {};
                    
                    headers.forEach((header, index) => {
                        testEntry[header.toLowerCase()] = values[index]?.trim() || '';
                    });
                    
                    testData.push(testEntry);
                }
            }

            return {
                success: true,
                data: testData,
                recordCount: testData.length
            };
        } catch (error) {
            console.error('CSV parsing error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // PDF Report Generation
    async generatePatientReport(patientData, testsData, options = {}) {
        try {
            const pdfDoc = await PDFDocument.create();
            const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
            const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
            
            const page = pdfDoc.addPage([612, 792]); // Standard letter size
            const { width, height } = page.getSize();
            
            let yPosition = height - 50;
            
            // Header
            page.drawText('EYE CLINIC MANAGEMENT SYSTEM', {
                x: 50,
                y: yPosition,
                size: 20,
                font: timesRomanBoldFont,
                color: rgb(0, 0, 0)
            });
            
            yPosition -= 40;
            
            page.drawText('Visual Field Test Report', {
                x: 50,
                y: yPosition,
                size: 16,
                font: timesRomanBoldFont,
                color: rgb(0.2, 0.2, 0.8)
            });
            
            yPosition -= 40;
            
            // Patient Information
            const patientInfo = [
                `Patient ID: ${patientData.patient_id}`,
                `Name: ${patientData.first_name} ${patientData.last_name}`,
                `Date of Birth: ${new Date(patientData.dob).toLocaleDateString()}`,
                `Gender: ${patientData.gender}`,
                `Contact: ${patientData.contact || 'N/A'}`,
                `Report Date: ${new Date().toLocaleDateString()}`
            ];
            
            page.drawText('Patient Information:', {
                x: 50,
                y: yPosition,
                size: 14,
                font: timesRomanBoldFont
            });
            
            yPosition -= 25;
            
            patientInfo.forEach(info => {
                page.drawText(info, {
                    x: 70,
                    y: yPosition,
                    size: 12,
                    font: timesRomanFont
                });
                yPosition -= 20;
            });
            
            yPosition -= 20;
            
            // Test Results
            if (testsData && testsData.length > 0) {
                page.drawText('Test Results:', {
                    x: 50,
                    y: yPosition,
                    size: 14,
                    font: timesRomanBoldFont
                });
                
                yPosition -= 25;
                
                testsData.forEach((test, index) => {
                    const testInfo = [
                        `Test ${index + 1} - Date: ${new Date(test.test_date).toLocaleDateString()}`,
                        `Eye: ${test.eye}`,
                        `Machine: ${test.machine_type}`,
                        `Status: Complete`
                    ];
                    
                    testInfo.forEach(info => {
                        page.drawText(info, {
                            x: 70,
                            y: yPosition,
                            size: 11,
                            font: timesRomanFont
                        });
                        yPosition -= 18;
                    });
                    
                    yPosition -= 10;
                });
            }
            
            // Footer
            page.drawText('Generated by Eye Clinic Management System', {
                x: 50,
                y: 50,
                size: 10,
                font: timesRomanFont,
                color: rgb(0.5, 0.5, 0.5)
            });
            
            const pdfBytes = await pdfDoc.save();
            
            return {
                success: true,
                pdfData: pdfBytes,
                fileName: `${patientData.patient_id}_report_${Date.now()}.pdf`
            };
            
        } catch (error) {
            console.error('PDF generation error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Open File in Default Application
    async openFile(filePath) {
        try {
            await shell.openPath(filePath);
            return { success: true };
        } catch (error) {
            console.error('File open error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Clean up temporary files
    async cleanupTempFiles() {
        try {
            if (this.tempDir) {
                await fs.emptyDir(this.tempDir);
            }
            return { success: true };
        } catch (error) {
            console.error('Cleanup error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export singleton instance
module.exports = new FileService();
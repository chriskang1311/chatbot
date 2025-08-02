#!/usr/bin/env python3
"""
Test script for file processing functionality
Run this to test PDF, Word document, and image processing locally
"""

import os
import base64
from file_utils import FileProcessor

def test_file_processing():
    """Test the file processing functionality"""
    processor = FileProcessor()
    
    print("🧪 Testing File Processing Functionality")
    print("=" * 50)
    
    # Test supported file types
    test_files = [
        ("test.pdf", "application/pdf"),
        ("document.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
        ("image.jpg", "image/jpeg"),
        ("screenshot.png", "image/png"),
        ("unsupported.txt", "text/plain")
    ]
    
    for filename, mime_type in test_files:
        print(f"\n📁 Testing: {filename}")
        print(f"   MIME Type: {mime_type}")
        
        # Check if file type is supported
        is_supported = processor.is_supported_file(filename)
        print(f"   Supported: {'✅ Yes' if is_supported else '❌ No'}")
        
        if is_supported:
            # Create dummy file data for testing
            dummy_data = b"This is dummy file content for testing purposes."
            
            # Process the file
            result = processor.process_file(dummy_data, filename)
            
            print(f"   Processing: {'✅ Success' if result['success'] else '❌ Failed'}")
            if not result['success']:
                print(f"   Error: {result['error']}")
            else:
                print(f"   File Type: {result['file_type']}")
                
                # Show content preview
                content = result['content']
                if result['file_type'] in ['pdf', 'docx', 'doc']:
                    text = content.get('text', '')
                    preview = text[:100] + "..." if len(text) > 100 else text
                    print(f"   Text Preview: {preview}")
                elif result['file_type'] in ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']:
                    info = content.get('info', {})
                    print(f"   Image Info: {info.get('size', 'Unknown size')} pixels")
    
    print("\n" + "=" * 50)
    print("✅ File processing test completed!")

def test_gpt_formatting():
    """Test the GPT content formatting"""
    processor = FileProcessor()
    
    print("\n🧪 Testing GPT Content Formatting")
    print("=" * 50)
    
    # Create sample processed files
    sample_files = [
        {
            "success": True,
            "filename": "sample.pdf",
            "file_type": "pdf",
            "content": {
                "text": "This is sample text from a PDF document. It contains important information that needs to be analyzed.",
                "page_count": 1
            }
        },
        {
            "success": True,
            "filename": "report.docx",
            "file_type": "docx",
            "content": {
                "text": "This is a Word document with tables and formatted text.",
                "paragraphs": 5,
                "tables": 2
            }
        },
        {
            "success": True,
            "filename": "chart.png",
            "file_type": "png",
            "content": {
                "info": {"size": (800, 600)},
                "mime_type": "image/png"
            }
        }
    ]
    
    # Format for GPT
    formatted_content = processor.format_content_for_gpt(sample_files)
    
    print("Formatted content for GPT:")
    print("-" * 30)
    print(formatted_content)
    
    print("\n" + "=" * 50)
    print("✅ GPT formatting test completed!")

if __name__ == "__main__":
    test_file_processing()
    test_gpt_formatting() 
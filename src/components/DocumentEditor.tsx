import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  AlignLeft, 
  List, 
  ArrowUp, 
  ArrowDown, 
  Trash2,
  FileText,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface ContentSection {
  id: string;
  type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'list';
  content: string;
  order: number;
}

interface DocumentEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ 
  initialContent = '', 
  onChange, 
  disabled = false 
}) => {
  const [sections, setSections] = useState<ContentSection[]>([]);

  // Parse initial content into sections
  useEffect(() => {
    if (initialContent && sections.length === 0) {
      const parsedSections = parseContentToSections(initialContent);
      setSections(parsedSections);
    }
  }, [initialContent]);

  // Convert sections to text format
  useEffect(() => {
    const textContent = sectionsToText(sections);
    onChange(textContent);
  }, [sections]);

  const parseContentToSections = (content: string): ContentSection[] => {
    if (!content.trim()) {
      return [{
        id: generateId(),
        type: 'paragraph',
        content: '',
        order: 0
      }];
    }

    const lines = content.split('\n');
    const parsed: ContentSection[] = [];
    let order = 0;

    for (const line of lines) {
      if (line.trim() === '') continue;
      
      let type: ContentSection['type'] = 'paragraph';
      let cleanContent = line.trim();

      if (line.startsWith('# ')) {
        type = 'heading1';
        cleanContent = line.substring(2).trim();
      } else if (line.startsWith('## ')) {
        type = 'heading2';
        cleanContent = line.substring(3).trim();
      } else if (line.startsWith('### ')) {
        type = 'heading3';
        cleanContent = line.substring(4).trim();
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        type = 'list';
        cleanContent = line.substring(2).trim();
      }

      parsed.push({
        id: generateId(),
        type,
        content: cleanContent,
        order: order++
      });
    }

    return parsed.length > 0 ? parsed : [{
      id: generateId(),
      type: 'paragraph',
      content: '',
      order: 0
    }];
  };

  const sectionsToText = (sections: ContentSection[]): string => {
    return sections
      .sort((a, b) => a.order - b.order)
      .map(section => {
        switch (section.type) {
          case 'heading1':
            return `# ${section.content}`;
          case 'heading2':
            return `## ${section.content}`;
          case 'heading3':
            return `### ${section.content}`;
          case 'list':
            return `- ${section.content}`;
          default:
            return section.content;
        }
      })
      .join('\n\n');
  };

  const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
  };

  const addSection = (type: ContentSection['type']) => {
    const newSection: ContentSection = {
      id: generateId(),
      type,
      content: '',
      order: sections.length
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, content: string) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, content } : section
    ));
  };

  const changeSectionType = (id: string, type: ContentSection['type']) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, type } : section
    ));
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === sections.length - 1)
    ) return;

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    // Update order
    newSections.forEach((section, idx) => {
      section.order = idx;
    });
    
    setSections(newSections);
  };

  const deleteSection = (id: string) => {
    if (sections.length === 1) return; // Keep at least one section
    
    const filtered = sections.filter(s => s.id !== id);
    // Update order
    filtered.forEach((section, idx) => {
      section.order = idx;
    });
    setSections(filtered);
  };

  const getSectionIcon = (type: ContentSection['type']) => {
    switch (type) {
      case 'heading1':
        return <Heading1 className="w-4 h-4" />;
      case 'heading2':
        return <Heading2 className="w-4 h-4" />;
      case 'heading3':
        return <Heading3 className="w-4 h-4" />;
      case 'list':
        return <List className="w-4 h-4" />;
      default:
        return <AlignLeft className="w-4 h-4" />;
    }
  };

  const getSectionPlaceholder = (type: ContentSection['type']) => {
    switch (type) {
      case 'heading1':
        return 'Tiêu đề chính...';
      case 'heading2':
        return 'Tiêu đề phụ...';
      case 'heading3':
        return 'Tiêu đề nhỏ...';
      case 'list':
        return 'Mục danh sách...';
      default:
        return 'Nội dung đoạn văn...';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Section Toolbar */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 mr-4">Thêm section:</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => addSection('heading1')}
              disabled={disabled}
              className="text-xs"
            >
              <Heading1 className="w-3 h-3 mr-1" />
              Tiêu đề 1
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => addSection('heading2')}
              disabled={disabled}
              className="text-xs"
            >
              <Heading2 className="w-3 h-3 mr-1" />
              Tiêu đề 2
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => addSection('heading3')}
              disabled={disabled}
              className="text-xs"
            >
              <Heading3 className="w-3 h-3 mr-1" />
              Tiêu đề 3
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => addSection('paragraph')}
              disabled={disabled}
              className="text-xs"
            >
              <AlignLeft className="w-3 h-3 mr-1" />
              Đoạn văn
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => addSection('list')}
              disabled={disabled}
              className="text-xs"
            >
              <List className="w-3 h-3 mr-1" />
              Danh sách
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <Card key={section.id} className="border-l-4 border-blue-500">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Section Type & Controls */}
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex items-center gap-1">
                    {getSectionIcon(section.type)}
                    <select
                      value={section.type}
                      onChange={(e) => changeSectionType(section.id, e.target.value as ContentSection['type'])}
                      disabled={disabled}
                      className="text-xs border border-gray-200 rounded px-1 py-0.5"
                    >
                      <option value="heading1">H1</option>
                      <option value="heading2">H2</option>
                      <option value="heading3">H3</option>
                      <option value="paragraph">P</option>
                      <option value="list">List</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => moveSection(section.id, 'up')}
                      disabled={disabled || index === 0}
                      className="w-6 h-6 p-0"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => moveSection(section.id, 'down')}
                      disabled={disabled || index === sections.length - 1}
                      className="w-6 h-6 p-0"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSection(section.id)}
                      disabled={disabled || sections.length === 1}
                      className="w-6 h-6 p-0 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Content Input */}
                <div className="flex-1">
                  {section.type === 'paragraph' ? (
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(section.id, e.target.value)}
                      placeholder={getSectionPlaceholder(section.type)}
                      rows={4}
                      disabled={disabled}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={section.content}
                      onChange={(e) => updateSection(section.id, e.target.value)}
                      placeholder={getSectionPlaceholder(section.type)}
                      disabled={disabled}
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        section.type === 'heading1' ? 'text-2xl font-bold' :
                        section.type === 'heading2' ? 'text-xl font-semibold' :
                        section.type === 'heading3' ? 'text-lg font-medium' :
                        'text-base'
                      }`}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add First Section if empty */}
      {sections.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Bắt đầu tạo nội dung
            </h3>
            <p className="text-gray-500 mb-4">
              Thêm tiêu đề, đoạn văn hoặc danh sách để tạo bài giảng
            </p>
            <Button
              type="button"
              onClick={() => addSection('paragraph')}
              disabled={disabled}
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm đoạn đầu tiên
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentEditor;


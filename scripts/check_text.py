import os
import argparse
import sys

def load_vocabulary(vocab_dir):
    """
    Load sensitive words from all .txt files in the vocabulary directory.
    """
    sensitive_words = set()
    if not os.path.exists(vocab_dir):
        print(f"Error: Vocabulary directory not found: {vocab_dir}")
        return sensitive_words

    for filename in os.listdir(vocab_dir):
        if filename.endswith(".txt"):
            filepath = os.path.join(vocab_dir, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    for line in f:
                        word = line.strip()
                        if word:
                            sensitive_words.add(word)
            except Exception as e:
                print(f"Warning: Failed to read {filename}: {e}")
                
    return sensitive_words

def check_file(target_file, sensitive_words):
    """
    Check the target file for sensitive words.
    """
    if not os.path.exists(target_file):
        print(f"Error: Target file not found: {target_file}")
        return

    found_issues = []
    
    try:
        with open(target_file, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                line_content = line.strip()
                for word in sensitive_words:
                    if word in line_content:
                        found_issues.append((line_num, word, line_content))
    except Exception as e:
        print(f"Error reading target file: {e}")
        return

    if found_issues:
        print(f"Found {len(found_issues)} sensitive word occurrences in {target_file}:")
        for line_num, word, content in found_issues:
            print(f"Line {line_num}: Found '{word}' in text: ...{content[:50]}...")
        # Return non-zero exit code to indicate issues found
        sys.exit(1) 
    else:
        print(f"No sensitive words found in {target_file}.")
        sys.exit(0)

def main():
    parser = argparse.ArgumentParser(description="Check file for sensitive words.")
    parser.add_argument("--target_file", required=True, help="Path to the file to check.")
    # Default to the bundled assets/vocabulary directory relative to this script
    default_vocab_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "vocabulary")
    parser.add_argument("--vocab_dir", default=default_vocab_dir, help="Path to the vocabulary directory.")
    
    args = parser.parse_args()
    
    print(f"Loading vocabulary from: {os.path.abspath(args.vocab_dir)}")
    sensitive_words = load_vocabulary(args.vocab_dir)
    print(f"Loaded {len(sensitive_words)} sensitive words.")
    
    print(f"Checking file: {args.target_file}")
    check_file(args.target_file, sensitive_words)

if __name__ == "__main__":
    main()

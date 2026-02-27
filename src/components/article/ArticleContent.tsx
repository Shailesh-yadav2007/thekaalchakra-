interface ArticleContentProps {
    content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
    return (
        <div
            className="article-body prose"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}

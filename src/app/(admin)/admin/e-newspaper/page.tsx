import { prisma } from "@/lib/prisma";

export default async function ENewspaperAdminPage() {
    const newspapers = await prisma.eNewspaper.findMany({
        orderBy: { publishDate: "desc" },
    });

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">E-Newspaper Management</h1>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title (EN)</th>
                            <th>Title (HI)</th>
                            <th>Language</th>
                            <th>Publish Date</th>
                            <th>PDF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newspapers.map((paper: typeof newspapers[number]) => (
                            <tr key={paper.id}>
                                <td>{paper.titleEn}</td>
                                <td>{paper.titleHi}</td>
                                <td>
                                    <span className={`status-badge`}>
                                        {paper.language}
                                    </span>
                                </td>
                                <td>{paper.publishDate.toLocaleDateString()}</td>
                                <td>
                                    <a
                                        href={paper.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="table-link"
                                    >
                                        View PDF
                                    </a>
                                </td>
                            </tr>
                        ))}
                        {newspapers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">
                                    No e-newspaper editions uploaded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

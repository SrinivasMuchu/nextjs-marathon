
import Link from 'next/link';
import ServerBreadCrumbs from './ServerBreadCrumbs';


export default function ActiveLastBreadcrumb({ links = [] }) {

  return (
    <>
      
     <ServerBreadCrumbs links={links}/>
      <div className="px-4 py-2 bg-gray-100 border-b border-gray-300 sticky top-16 z-50 text-sm">
        <nav aria-label="breadcrumb">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="text-gray-600 hover:underline">
                Home /
              </Link>
            </li>

            {links.map((item, index) => {
              const isLast = index === links.length - 1;

              return (
                <li key={index}>
                  {isLast ? (
                    <span className="text-[#610bee] font-medium">{item.label}</span>
                  ) : (
                    <Link href={item.href} className="text-gray-600 hover:underline">
                      {item.label} /
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </>
  );
}

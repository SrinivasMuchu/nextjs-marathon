
import Link from 'next/link';
import ServerBreadCrumbs from './ServerBreadCrumbs';


export default function ActiveLastBreadcrumb({ links = [] }) {

  return (
    <>
      
     <ServerBreadCrumbs links={links}/>
      <div className="py-2 bg-white sticky top-20 z-50 text-sm">
        <nav aria-label="breadcrumb" className="w-full box-border px-16 max-lg:px-8">
          <ol className="flex flex-wrap gap-2 justify-start">
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

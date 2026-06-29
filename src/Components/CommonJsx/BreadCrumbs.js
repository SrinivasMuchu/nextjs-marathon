
import Link from 'next/link';
import ServerBreadCrumbs from './ServerBreadCrumbs';


export default function ActiveLastBreadcrumb({ links = [], alignWithHeader = false, skipSchema = false }) {
  const navPad = alignWithHeader
    ? "px-0"
    : "px-16 max-lg:px-8";

  return (
    <>
      {!skipSchema ? <ServerBreadCrumbs links={links}/> : null}
      <div className="py-2 bg-white text-sm">
        <nav aria-label="breadcrumb" className={`w-full box-border ${navPad}`}>
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
